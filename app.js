require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const compression = require("compression");
const helmet = require("helmet");
const createError = require("http-errors");

const indexRouter = require("./routes/index");
// const usersRouter = require("./routes/users");
const articlesRouter = require("./routes/articles");

const app = express();

app.use(helmet());
app.use(compression());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/articles", articlesRouter);
// app.use("/users", usersRouter);

module.exports = app;
