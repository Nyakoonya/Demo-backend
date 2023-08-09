module.exports = (header, firstRow) => {
  console.log("header---->>>", header);
  if (header && header.length > 0) {
    let model = {};
    header.forEach((h, i) => {
      if (!model[h]) {
        model[h] = {
          type: checkType(firstRow[i]),
        };
      }
    });
    return model;
  }
  return {};
};

const checkType = (param) => {
  switch (typeof param) {
    case "string":
      return "STRING";
    case "number":
      if (param % 1 != 0) {
        return "FLOAT";
      }
      return "INTEGER";
    case "boolean":
      return "BOOLEAN";
    default:
      return "STRING";
  }
};
