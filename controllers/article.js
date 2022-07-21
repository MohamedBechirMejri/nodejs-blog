/* eslint-disable consistent-return */
const { validationResult, sanitizeBody, body } = require("express-validator");

const Article = require("../models/Article");
const Category = require("../models/Category");
const User = require("../models/User");

exports.index = (req, res, next) => {
  Article.find()
    .populate("author category")
    .exec((err, items) => {
      if (err) return next(err);
      res.json(items);
    });
};
