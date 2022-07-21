/* eslint-disable consistent-return */
const { validationResult, sanitizeBody, body } = require("express-validator");

const Article = require("../models/Article");
const Category = require("../models/Category");
const User = require("../models/User");

exports.index = (req, res, next) => {
  Article.find({
    isPublished: true,
  })
    .populate("category")
    .exec((err, items) => {
      if (err) return next(err);
      res.json(items);
    });
};

exports.show = (req, res, next) => {
  Article.findById(req.params.id)
    .populate("category")
    .populate("author", "firstName lastName picture")
    .exec((err, item) => {
      if (err) return next(err);
      res.json(item);
    });
};
