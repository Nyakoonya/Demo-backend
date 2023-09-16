const { sequelize } = require("../models");
const { CODE_ERROR, CODE_SUCCESS } = require("../utils/constant");
const ownerId = global.userId || "a861b242-1f51-11ee-a44a-70bb57828822";
const owner = global.username || "admin";
const initialName = "untitled";
const Folder = require("../models").folder;
const Datasource = require("../models").datasource;
const Dashboard = require("../models").dashboard;
function createFolder(req, res, next) {
  Folder.create({
    title: initialName,
    owner,
    ownerId,
    description: "",
    img: "",
  })
    .then(() => {
      res.json({
        code: CODE_SUCCESS,
        msg: "create successful",
        data: null,
      });
    })
    .catch((error) => {
      res.json({
        code: CODE_ERROR,
        msg: error.message,
        data: null,
      });
    });
}

function readFoldersByUser(req, res, next) {
  Folder.findAll({
    where: {
      ownerId,
    },
  })
    .then((result) => {
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
          data: {
            list: result,
          },
        });
      }
    })
    .catch((error) => {
      res.json({
        code: CODE_ERROR,
        msg: error.message,
        data: null,
      });
    });
}
function updateFolderInfo(req, res, next) {
  const { id, title, description } = req.body;

  Folder.update(
    {
      title,
      description,
    },
    {
      where: {
        id,
      },
    }
  )
    .then(() => {
      res.json({
        code: CODE_SUCCESS,
        msg: "update successful",
        data: null,
      });
    })
    .catch((error) => {
      res.json({
        code: CODE_ERROR,
        msg: error.message,
        data: null,
      });
    });
}

function deleteFolderById(req, res, next) {
  const { id } = req.params;

  Folder.destroy({
    where: {
      id,
    },
  }).then(() => {
    Datasource.destroy({
      where: {
        folderId: id,
      },
    })
  })
  .then(() => {
    sequelize.query(`DELETE FROM REPORTS WHERE dashId in (SELECT id FROM DASHBOARDS WHERE folderId =${id})`);
  })
  .then(() => {
    Dashboard.destroy({
      where: {
        folderId: id,
      },
    })
  })
    .then(() => {
      res.json({
        code: CODE_SUCCESS,
        msg: "Delete successfully!",
        data: null,
      });
    })
    .catch((error) => {
      res.json({
        code: CODE_ERROR,
        msg: error.message,
        data: null,
      });
    });
}

module.exports = {
  createFolder,
  readFoldersByUser,
  updateFolderInfo,
  deleteFolderById,
};
