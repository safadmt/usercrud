const express = require("express");
const bodyParser = require("body-parser");
const ejsLayout = require("express-ejs-layouts");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();

const port = process.env.PORT;

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/users");

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

app.use(ejsLayout);
app.set('layout', './layout/layout.ejs')
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", adminRouter);
app.use("/", userRouter);

app.listen(port, err =>
  err ? console.log("Something went wrong. Can't connect to server") : console.log(`Server connected on port ${port}`)
);
