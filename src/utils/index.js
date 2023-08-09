const mysql = require("mysql");
const config = require("../db/config");

// connect mysql
function connect() {
  const { host, user, password, database } = config;
  return mysql.createConnection({
    host,
    user,
    password,
    database,
  });
}

// create query connection
function querySql(sql) {
  const _connect = connect();
  return new Promise((resolve, reject) => {
    try {
      _connect.query(sql, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    } catch (err) {
      console.log("err :>>", err);
      reject(err);
    } finally {
      // release the connection
      _connect.end();
    }
  });
}

// query one sql
function queryOne(sql) {
  return new Promise((resolve, reject) => {
    querySql(sql)
      .then((res) => {
        console.log("res", res);
        if (res && res.length > 0) {
          resolve(res[0]);
        } else {
          resolve(null);
        }
      })
      .catch((err) => {
        console.log("err queryOne", err);
        reject(err);
      });
  });
}

module.exports = {
  querySql,
  queryOne,
};
