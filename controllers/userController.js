const { userSignup, userLogin } = require("../helpers/user_helpers");

module.exports = {
  loginPage: (req, res) => {
    if (req.session.user) {
      if (req.session.user.role === "Admin") {
        return res.redirect("/admin");
      } else {
        return res.redirect("/");
      }
    }
    const user = {
      role: req.session.user ? req.session.user.role : "",
      email: req.session.user ? req.session.user.email : "",
    };
    res.setHeader("Cache-Control", "no-cache, no-store , must-revalidate");
    res.render("pages/userlogin", { user: user, error: null });
  },

  signupPage: (req, res) => {
    if (req.session.user) {
      if (req.session.user.role === "Admin") {
        return res.redirect("/admin");
      } else {
        return res.redirect("/");
      }
    }
    const user = {
      role: req.session.user ? req.session.user.role : "",
      email: req.session.user ? req.session.user.email : "",
    };

    res.render("pages/signup", { user: user, error: null });
  },

  login: (req, res) => {
    const { email, password } = req.body;

    const user = {
      role: req.session.user ? req.session.user.role : "",
      email: req.session.user ? req.session.user.email : "",
    };
    if (!email || !password) {
      return res.render("pages/userlogin", {
        user: user,
        error: "All field is required",
      });
    }

    if (password.length < 8 || password.length > 16) {
      return res.render("pages/userlogin", {
        user: user,
        error: "Password length contain 8 to 16 charactors",
      });
    }

    userLogin(req.body).then((response) => {
      console.log(response);
      if (response.error) {
        return res.render("pages/userlogin", {
          user: user,
          error: response.error,
        });
      }
      req.session.user = {
        role: response.user.role,
        email: response.user.email,
      };
      if (response.user.role === "Admin") {
        res.redirect("/admin");
      } else {
        res.redirect("/");
      }
    });
  },

  userDashboared: (req, res) => {
    const user = {
      role: req.session.user ? req.session.user.role : "",
      email: req.session.user ? req.session.user.email : "",
    };
    res.render("pages/user/userDashboared", { user: user });
  },

  signup: (req, res) => {
    const { username, email, mobile, gender, password } = req.body;

    const user = {
      role: req.session.user ? req.session.user.role : "",
      email: req.session.user ? req.session.user.email : "",
    };
    if (!req.body || !email || !mobile || !gender || !password) {
      return res.render("pages/signup", {
        user: user,
        error: "Required all field",
      });
    }

    if (mobile.length !== 10) {
      return res.render("pages/signup", {
        user: user,
        error: "Mobile number length must be 10",
      });
    }
    if (typeof parseInt(Number) !== "number") {
      return res.render("pages/signup", {
        user: user,
        error: "Only numbers are allowed to enter in the mobile field",
      });
    }

    if (username.trim().length === 0) {
      return res.render("pages/signup", {
        user: user,
        error: "Username is required",
      });
    }

    if (password.length < 8 || password.length > 16) {
      return res.render("pages/signup", {
        user: user,
        error: "Password length contain 8 to 16 charactors",
      });
    }

    userSignup(req.body).then((response) => {
      console.log(response);
      if (response.error) {
        return res.render("pages/signup", {
          user: user,
          error: response.error,
        });
      } else {
        req.session.user = {
          role: response.user.role,
          email: response.user.email,
        };
        if (response.user.role === "Admin") {
          res.redirect("/admin");
        } else {
          res.redirect("/");
        }
      }
    });
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        throw err;
      } else {
        res.clearCookie("connect.sid");

        res.redirect("/login");
      }
    });
  },
};
