import http from "http";
import fs from "fs";
import path from "path";

const PORT = process.env.PORT || 3000;
const DIST = path.join(path.dirname(new URL(import.meta.url).pathname), "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
};

http.createServer((req, res) => {
  let url = req.url.split("?")[0];
  if (url === "/") url = "/index.html";
  const ext = path.extname(url);

  fs.readFile(path.join(DIST, url), (err, data) => {
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
}).listen(PORT, "0.0.0.0", () => console.log("Running on port " + PORT));