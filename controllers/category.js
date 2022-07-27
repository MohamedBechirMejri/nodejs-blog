const Category = require("../models/Category");

exports.index = (req, res, next) => {
  Category.find()
    .exec((err, items) => {
      if (err) return next(err);
      return res.json(items);
    });
};
