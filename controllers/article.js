/* eslint-disable no-shadow */
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

exports.create = [
  body("title")
    .isLength({ min: 5 })
    .trim()
    .withMessage("Title must be at least 5 characters"),
  body("body")
    .isLength({ min: 25 })
    .trim()
    .withMessage("Body must be at least 25 characters"),
  body("category")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Category must be selected"),
  body("author")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Author must be selected"),
  body("image").isLength({ min: 1 }).trim().withMessage("Image link missing!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { title, body, image, category, author } = req.body;

    const article = new Article({
      title,
      body,
      image,
      category,
      author,
    });

    article.save((err, item) => {
      if (err) return next(err);
      res.json(item);
    });
  },
];

exports.update = [
  body("title")
    .isLength({ min: 5 })
    .trim()
    .withMessage("Title must be at least 5 characters"),
  body("body")
    .isLength({ min: 25 })
    .trim()
    .withMessage("Body must be at least 25 characters"),
  body("category")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Category must be selected"),
  body("image").isLength({ min: 1 }).trim().withMessage("Image link missing!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { title, body, image, category } = req.body;

    Article.findByIdAndUpdate(
      req.params.id,
      {
        title,
        body,
        image,
        category,
      },
      (err, item) => {
        if (err) return next(err);
        res.json(item);
      }
    );
  },
];

exports.deleteArticle = (req, res, next) => {
  Article.findByIdAndRemove(req.params.id, (err, item) => {
    if (err) return next(err);
    res.json(item);
  });
};
