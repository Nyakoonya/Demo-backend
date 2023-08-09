const crypto = require("crypto");

function md5(s) {
  return crypto
    .createHash("md5")
    .update("demo" + s)
    .digest("hex");
}

function decodeAes(encrypted) {
  const key = "demo";
  const decipher = crypto.createDecipher("aes192", key);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = {
  md5,
  decodeAes,
};
