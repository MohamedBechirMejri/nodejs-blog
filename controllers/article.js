/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const { validationResult, body } = require("express-validator");
const jwt = require("jsonwebtoken");

const { Article, Comment } = require("../models/Article");
const User = require("../models/User");
const Category = require("../models/Category");

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
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) res.status(403).json({ message: err });
    req.user = authData.user;
  });
  Article.findById(req.params.id)
    .populate("category")
    .populate("author", "firstName lastName picture")
    .exec((err, item) => {
      if (err) return next(err);
      if (!item)
        return res.status(404).json({
          message: "Article not found",
        });

      if (!item.isPublished) {
        if (item.author.id === req.user._id || req.user.role === "admin")
          return res.json(item);
        return res.status(403).json({
          message:
            "You are not authorized to view this! Article is not published",
        });
      }
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
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) res.status(403).json({ message: err });
    });

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
  body("isPublished").isBoolean().withMessage("isPublished must be a boolean"),
  async (req, res, next) => {
    const article = await Article.findById(req.params.id);
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) res.sendStatus(403);

      if (
        article.author !== authData.user._id &&
        authData.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "You are not authorized to do this!" });
      }
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { title, body, image, category, isPublished } = req.body;

    Article.findByIdAndUpdate(
      req.params.id,
      {
        title,
        body,
        image,
        category,
        isPublished,
      },
      (err, item) => {
        if (err) return next(err);
        res.json(item);
      }
    );
  },
];

exports.deleteArticle = async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) res.sendStatus(403);

    if (
      article.author !== authData.user._id &&
      authData.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to do this!" });
    }
  });
  Article.findByIdAndRemove(req.params.id, (err, item) => {
    if (err) return next(err);
    res.json(item);
  });
};

exports.like = async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) res.sendStatus(403);

    if (article.likes.includes(authData.user._id))
      article.likes = article.likes.filter(id => id !== authData.user._id);
    else article.likes.push(authData.user._id);

    article.save((err, item) => {
      if (err) return next(err);
      res.json(item);
    });
  });
};

exports.publish = async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) res.sendStatus(403);

    if (
      article.author.toString() !== authData.user._id.toString() &&
      authData.user.role !== "admin"
    )
      return res.status(403).json({
        message: "You are not authorized to do this!",
      });
    article.isPublished = !article.isPublished;
    article.save((err, item) => {
      if (err) return next(err);
      res.json(item);
    });
  });
};

exports.bookmark = async (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) res.sendStatus(403);

    User.findById(authData.user._id).then(user => {
      if (user.bookmarks.includes(req.params.id))
        user.bookmarks = user.bookmarks.filter(id => id !== req.params.id);
      else user.bookmarks.push(req.params.id);
      user.save(err => {
        if (err) return next(err);
        res.json("Bookmarks updated!");
      });
    });
  });
};

exports.comment = async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) res.sendStatus(403);

    const comment = new Comment({
      body: req.body.body,
      user: authData.user._id,
    });

    article.comments.push(comment);
    article.save((err, item) => {
      if (err) return next(err);
      res.json(item);
    });
  });
};
