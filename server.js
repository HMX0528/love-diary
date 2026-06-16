import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const DOMAIN = "www.hmxlovely.com";
const DIST = path.join(__dirname, "dist");
const DATA_DIR = path.join(__dirname, "data");
const IMG_DIR = path.join(DATA_DIR, "images");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

function getLocalIPs() {
  const ifaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (c) => { body += c; });
    req.on("end", () => {
      try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
    });
  });
}

function readJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf-8")); }
  catch { return null; }
}

var serverHandler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  var url = req.url.split("?")[0];
  /* ── Export endpoint ── */
  if (url === "/api/export" && req.method === "POST") {
    let body = "";
    req.on("data", (c) => { body += c; });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const dir = path.join(__dirname, "data");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "content.json"), JSON.stringify(data, null, 2), "utf-8");
        console.log("Content exported");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        console.error("Export error:", e);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }


  var query = req.url.indexOf("?") >= 0 ? req.url.split("?")[1] : "";

  /* ===== API Routes ===== */
  if (url === "/api/content") {
    if (req.method === "GET") {
      var data = readJSON(CONTENT_FILE) || {};
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    } else if (req.method === "POST") {
      try {
        var body = await parseBody(req);
        fs.writeFileSync(CONTENT_FILE, JSON.stringify(body, null, 2), "utf-8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400); res.end(JSON.stringify({ error: e.message }));
      }
    } else { res.writeHead(405); res.end(); }
    return;
  }

  if (url === "/api/image") {
    if (req.method === "GET") {
      var params = new URLSearchParams(query);
      var imgPath = params.get("path");
      var filePath = path.join(IMG_DIR, imgPath.replace(/[^a-zA-Z0-9_.-]/g, "") + ".json");
      var imgData = readJSON(filePath);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(imgData || { data: null }));
    } else if (req.method === "POST") {
      try {
        var body = await parseBody(req);
        var safeName = body.path.replace(/[^a-zA-Z0-9_.-]/g, "");
        fs.writeFileSync(path.join(IMG_DIR, safeName + ".json"), JSON.stringify(body), "utf-8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400); res.end(JSON.stringify({ error: e.message }));
      }
    } else { res.writeHead(405); res.end(); }
    return;
  }

    if (url === "/api/all-images") {
    try {
      var files = fs.readdirSync(IMG_DIR);
      var all = {};
      files.forEach(function(f) {
        if (f.endsWith(".json")) {
          var d = readJSON(path.join(IMG_DIR, f));
          if (d && d.data) { all[d.path] = d.data; }
        }
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(all));
    } catch (e) {
      res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }
  if (url === "/import") {
    fs.readFile(path.join(DIST, "import.html"), (err, data) => {
      if (err) { res.writeHead(500); res.end("Error"); return; }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
    return;
  }

  /* ===== Redirect non-localhost ===== */
  var host = req.headers.host || "";
  if (!host.includes("localhost") && !host.includes("127.0.0.1")) {
    res.writeHead(301, { "Location": "http://localhost:3000" + req.url });
    res.end();
    return;
  }

  /* ===== Static file server ===== */
  if (url === "/") url = "/index.html";
  var filePath2 = path.join(DIST, url);
  var ext = path.extname(filePath2);
  fs.readFile(filePath2, (err, data) => {
    if (err) {
      fs.readFile(path.join(DIST, "index.html"), (err2, data2) => {
        if (err2) { res.writeHead(500); res.end("Error"); return; }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data2);
      });
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
};

http.createServer(serverHandler).listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("  .----------------------------------------------.");
  console.log("  |  刘颖 x 胡鸣曦    恋 爱 日 记              |");
  console.log("  |  (服务器端存储版本)                          |");
  console.log("  |                                            |");
  console.log("  |  http://" + DOMAIN + ":" + PORT + "/   (hosts)  |");
  console.log("  |  http://localhost:" + PORT + "/   (loc)       |");
  var ips = getLocalIPs();
  for (var i = 0; i < ips.length; i++) {
    var a = "  |  http://" + ips[i] + ":" + PORT + "/";
    while (a.length < 46) { a += " "; }
    console.log(a + "|");
  }
  console.log("  |                                            |");
  console.log("  |  所有人共享同一份数据                      |");
  console.log("  |  编辑内容自动保存到服务器                   |");
  console.log("  |  手机: 同WiFi打开 局域网 地址               |");
  console.log("  .----------------------------------------------.");
  console.log("");

var certOpts = { key: fs.readFileSync("./cert/key.pem"), cert: fs.readFileSync("./cert/cert.pem") };
https.createServer(certOpts, serverHandler).listen(3443, "0.0.0.0", () => {
  console.log("  HTTPS: https://localhost:3443");
});
})
