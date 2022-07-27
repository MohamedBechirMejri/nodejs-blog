/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const { validationResult, body } = require("express-validator");
const jwt = require("jsonwebtoken");

const Article = require("../models/Article");
const User = require("../models/User");
const Category = require("../models/Category");

exports.index = (req, res, next) => {
  Article.find({
    isPublished: true,
  })
    .populate("author", "firstName lastName picture")
    .exec((err, items) => {
      if (err) return next(err);
      res.json(items);
    });
};

exports.show = (req, res, next) => {
  Article.findById(req.params.id)
    .populate("category")
    .populate("author", "firstName lastName picture")
    .populate("comments.user", "firstName lastName picture")
    .exec((err, item) => {
      if (err) return next(err);
      if (!item)
        return res.status(404).json({
          message: "Article not found",
        });

      if (!item.isPublished) {
        const bearerHeader = req.headers.authorization;
        if (typeof bearerHeader !== "undefined") {
          const bearer = bearerHeader.split(" ");
          const bearerToken = bearer[1];
          req.token = bearerToken;
        } else {
          return res.status(403).json({ message: "unauthorized" });
        }
        jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
          if (err) res.status(403).json({ message: err });
          req.user = authData.user;
        });
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
  body("image").isLength({ min: 1 }).trim().withMessage("Image link missing!"),

  (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) res.status(403).json({ message: err });
      req.user = authData.user;
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { title, body, image, category } = req.body;

    const article = new Article({
      title,
      body,
      image,
      category,
      author: req.user._id,
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
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) res.sendStatus(403);

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      Article.findById(req.params.id).then(article => {
        if (
          article.author.toString() !== authData.user._id.toString() &&
          authData.user.role !== "admin"
        ) {
          return res.status(403).json({
            message: "You are not authorized to do this!",
          });
        }
        const { title, body, image, category } = req.body;

        article.title = title;
        article.body = body;
        article.image = image;
        article.category = category;

        article.save((err, item) => {
          if (err) return next(err);
          res.json(item);
        });
      });
    });
  },
];

exports.deleteArticle = async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) res.sendStatus(403);

    if (
      article.author.toString() !== authData.user._id.toString() &&
      authData.user.role !== "admin"
    )
      return res
        .status(403)
        .json({ message: "You are not authorized to do this!" });

    article.remove((err, item) => {
      if (err) return next(err);
      res.json("Deleted successfully");
    });
  });
};

exports.like = async (req, res, next) => {
  const article = await Article.findById(req.params.id).populate("author");
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) res.sendStatus(403);

    if (article.likes.includes(authData.user._id)) {
      article.likes = article.likes.filter(
        id => id.toString() !== authData.user._id.toString()
      );
    } else article.likes.push(authData.user._id);

    article.save((err, item) => {
      if (err) return next(err);
      res.json(item);
    });
  });
};

exports.publish = async (req, res, next) => {
  const article = await Article.findById(req.params.id).populate("author");
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) res.status(403).json({ message: err });
    if (
      article.author._id.toString() !== authData.user._id.toString() &&
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
    let isBookmarked = false;
    User.findById(authData.user._id).then(user => {
      if (user.bookmarks.includes(req.params.id))
        user.bookmarks = user.bookmarks.filter(
          id => id.toString() !== req.params.id.toString()
        );
      else {
        user.bookmarks.push(req.params.id);
        isBookmarked = true;
      }
      user.save(err => {
        if (err) return next(err);
        res.json(isBookmarked ? "Bookmark Added!" : "Bookmark Removed!");
      });
    });
  });
};

exports.comment = async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) res.sendStatus(403);

    const comment = {
      body: req.body.body,
      user: authData.user._id,
    };

    article.comments.push(comment);
    article.save(err => {
      if (err) return next(err);
      Article.findById(req.params.id)
        .populate("author", "firstName lastName picture")
        .populate("comments.user", "firstName lastName picture")
        .then(article => {
          res.json(article);
        });
    });
  });
};
