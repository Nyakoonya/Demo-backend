const { querySql } = require("../utils");
const { CODE_ERROR, CODE_SUCCESS } = require("../utils/constant");

function createFolder(req, res, next) {
  const id = global.userId || "a861b242-1f51-11ee-a44a-70bb57828822";
  const owner = global.username || "admin";
  const initialName = "untitled";
  const query = `insert into Folders(id, ownerId, name, description, img, owner) values (UUID_TO_BIN(UUID()), UUID_TO_BIN('${id}'), '${initialName}', '', '', '${username}' )`;
  querySql(query)
    .then((result) => {
      if (!result || result.length === 0) {
        res.json({
          code: CODE_ERROR,
          msg: "create failed",
          data: null,
        });
      } else {
        console.log("insert successful!");
        // const folderData = {

        // }
        res.json({
          code: CODE_SUCCESS,
          msg: "create successful",
          data: null,
        });
      }
    })
    .catch((err) => {
      console.log("query err", err);
    });
}

function readFoldersByUser(req, res, next) {
  const id = global.userId || "a861b242-1f51-11ee-a44a-70bb57828822";
  const query = `select BIN_TO_UUID(id) id, name, BIN_TO_UUID(ownerId) ownerId, owner, description, img  from Folders where ownerId=UUID_TO_BIN('${id}')`;
  querySql(query).then((result) => {
    console.log("read folders", result);
    if (!result) {
      res.json({
        code: CODE_ERROR,
        msg: "query failed",
        data: null,
      });
    } else {
      res.json({
        code: CODE_SUCCESS,
        msg: "query successful",
        data: result,
      });
    }
  });
}
function updateFolderInfo(req, res, next) {
  const { id, name, description, img } = req.body;
  console.log("body", req.body);
  const query = `update Folders set name='${name}', description='${description}', img='${img}' where id=UUID_TO_BIN('${id}')`;
  querySql(query).then((result) => {
    if (!result) {
      res.json({
        code: CODE_ERROR,
        msg: "update failed",
        data: null,
      });
    } else {
      res.json({
        code: CODE_SUCCESS,
        msg: "update successful",
        data: null,
      });
    }
  });
}

function deleteFolderById(req, res, next) {
  const { id } = req.params;
  const findQuery = `select * from Folders where id=UUID_TO_BIN('${id}')`;
  const deleteQuery = `delete from Folders where id=UUID_TO_BIN('${id}')`;
  querySql(findQuery).then((result) => {
    if (!result) {
      res.json({
        code: CODE_ERROR,
        msg: "cannot find this folder",
        data: null,
      });
    } else {
      querySql(deleteQuery).then((result) => {
        if (!result) {
          res.json({
            code: CODE_ERROR,
            msg: "delete failed",
            data: null,
          });
        } else {
          res.json({
            code: CODE_SUCCESS,
            msg: "delete successful",
            data: null,
          });
        }
      });
    }
  });
}

module.exports = {
  createFolder,
  readFoldersByUser,
  updateFolderInfo,
  deleteFolderById,
};
