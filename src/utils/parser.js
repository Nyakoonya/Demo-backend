const uuid = require("uuid");
const UUID_TO_BIN = (id) => uuid.parse(id, new Buffer(16));

module.exports = {
  UUID_TO_BIN,
};
