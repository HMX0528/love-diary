const forge = require("node-forge");
const fs = require("fs");
const path = require("path");

const certDir = path.join(__dirname, "cert");
if (!fs.existsSync(certDir)) fs.mkdirSync(certDir);

var keys = forge.pki.rsa.generateKeyPair(2048);
var cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = "01";
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 1);

var attrs = [{ name: "commonName", value: "localhost" }];
cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey);

var pemKey = forge.pki.privateKeyToPem(keys.privateKey);
var pemCert = forge.pki.certificateToPem(cert);

fs.writeFileSync(path.join(certDir, "key.pem"), pemKey);
fs.writeFileSync(path.join(certDir, "cert.pem"), pemCert);
console.log("Cert generated: " + path.join(certDir, "cert.pem"));
