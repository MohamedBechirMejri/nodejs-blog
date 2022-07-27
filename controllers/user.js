const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Article = require("../models/Article");

exports.show = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) res.status(403).json({ message: err });
    req.user = authData.user;
  });
  User.findById(req.user._id)
    .populate("bookmarks", "title author image likes _id")
    .exec((err, item) => {
      if (err) return next(err);
      if (!item)
        return res.status(404).json({
          message: "User not found",
        });
      const user = {
        id: item._id,
        firstName: item.firstName,
        lastName: item.lastName,
        picture: item.picture,
        bookmarks: item.bookmarks,
        role: item.role,
      };

      return res.json(user);
    });
};
