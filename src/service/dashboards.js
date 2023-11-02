const { CODE_ERROR, CODE_SUCCESS } = require("../utils/constant");
const db = require("../models");
const uuid = require("uuid");
const id = global.userId || "a861b242-1f51-11ee-a44a-70bb57828822";
const owner = global.username || "admin";
const initialName = "untitled";
const Dashboard = db.dashboard;
const Folder = db.folder;
const Mainpage_settings = db.Mainpage_settings;
const Report = db.report;
function createDashboard(req, res, next) {
  const { folderId } = req.body;
  Dashboard.create({
    title: initialName,
    folderId,
    ownerId: id,
  })
    .then(() => {
      res.json({
        code: CODE_SUCCESS,
        msg: "Create dashboard successfully!",
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

function findAllDashboards(req, res) {
  const { folderId } = req.query;
  Dashboard.findAll({
    where: {
      folderId,
    },
  })
    .then((result) => {
      console.log("result", result);
      res.json({
        code: CODE_SUCCESS,
        msg: "Get dashboard successfully!",
        data: result,
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

function updateDashboard(req, res) {
  const { id, folderId, title, description } = req.body;
  console.log("req.body", req.body);
  Dashboard.update(
    {
      title,
      description,
    },
    {
      where: {
        id,
        folderId,
      },
    }
  )
    .then(() => {
      res.json({
        code: CODE_SUCCESS,
        msg: "Update successfully!",
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

// delete dashboard, reports, dataSettings...
function deleteDashboard(req, res) {
  const { id } = req.params;
  Dashboard.destroy({
    where: {
      id,
    },
  })
    .then(() => {
      Report.destroy({
        where: {
          dashId: id,
        },
      });
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

// set main page dashboard
function setmainpagedashboard(req, res) {
  const { id } = req.params;
  Mainpage_settings.update(
    {
      item_value: id,
    },
    {
      where: {
        id: "main_page_dashboard_id",
      },
    }
  )
    .then(() => {
      res.json({
        code: CODE_SUCCESS,
        msg: "Update successfully!",
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
function fetchDashInfoOnMainPage(req, res) {
  Mainpage_settings.findAll({
    where: {
      id: "main_page_dashboard_id",
    },
  })
    .then((result) => {
      console.log("result1---- fetch all reports", result);
      if (result.length > 0 && result[0].item_value != null) {
        Dashboard.findAll({
          where: {
            id: result[0].item_value,
          },
        }).then((dashRes) => {
          console.log("dashRes", dashRes);
          if (dashRes.length > 0) {
            Folder.findAll({
              where: {
                id: dashRes[0].folderId,
              },
            }).then((folderRes) => {
              if (folderRes.length > 0) {
                res.json({
                  code: CODE_SUCCESS,
                  msg: "Get main page successfully!",
                  data: {
                    folderTitle: folderRes[0].title,
                    folderId: folderRes[0].id,
                    dashTitle: dashRes[0].title,
                    dashId: dashRes[0].id,
                  },
                });
              }
            });
          }
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

module.exports = {
  createDashboard,
  findAllDashboards,
  updateDashboard,
  deleteDashboard,
  setmainpagedashboard,
  fetchDashInfoOnMainPage,
};
