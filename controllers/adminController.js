const {
  getAllUser,
  getOneUser,
  updateUser,
  deleteOneUser,
  searchUser,
} = require("../helpers/user_helpers");

module.exports = {
  adminDashboared: (req, res) => {
    const user = {
      role: req.session.user ? req.session.user.role : "",
      email: req.session.user ? req.session.user.email : "",
    };
    getAllUser().then((response) => {
      if (response.length > 0) {
        res.render("pages/admin/adminpage", {
          user: user,
          users: response,
          message: "",
        });
      } else {
        res.render("pages/admin/adminpage", {
          user: user,
          users: response,
          message: "Users not registered",
        });
      }
    });
  },

  getEditUser: (req, res) => {
    const user = {
      role: req.session.user ? req.session.user.role : "",
      email: req.session.user ? req.session.user.email : "",
    };
    getOneUser(req.params.userid).then((response) => {
      res.render("pages/admin/editpage", {
        user: user,
        user: response,
        error: "",
      });
    });
  },

  editUser: (req, res) => {
    updateUser(req.params.userid, req.body).then((response) => {
      console.log(response);
      res.json(response);
    });
  },

  deleteUser: (req, res) => {
    console.log(req.params)
    deleteOneUser(req.params.userid)
    .then((response) => {
      res.json("Ok");
    });
  },

  searrchUser: (req, res) => {
    if (!req.body) return;

    const user = {
      role: req.session.user ? req.session.user.role : "",
      email: req.session.user ? req.session.user.email : "",
    };
    searchUser(req.query.search).then((response) => {
      if (response.length > 0) {
        res.render("pages/admin/adminpage", {
          user: user,
          users: response,
          message: "",
        });
      } else {
        res.render("pages/admin/adminpage", {
          user: user,
          users: [],
          message: `Search result not match for "${req.query.search}"`,
        });
      }
    });
  },
};
