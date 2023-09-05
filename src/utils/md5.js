const crypto = require("crypto");
const CryptoJS = require("crypto-js");

function md5(s) {
  return crypto
    .createHash("md5")
    .update("demo" + s)
    .digest("hex");
}

function decodeAes(encrypted) {
  const secretPassphrase = CryptoJS.enc.Utf8.parse("demo");
  const iv = CryptoJS.enc.Utf8.parse("demo");
  const decrypted = CryptoJS.AES.decrypt(encrypted, secretPassphrase, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv,
  }).toString(CryptoJS.enc.Utf8);
  return decrypted;
}

module.exports = {
  md5,
  decodeAes,
};
console.log('md5', md5('111111'))