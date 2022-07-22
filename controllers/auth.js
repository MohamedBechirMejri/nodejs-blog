/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

exports.signup = [
  body("firstName")
    .not()
    .isEmpty()
    .withMessage("First name is required")
    .trim()
    .escape(),
  body("lastName")
    .not()
    .isEmpty()
    .withMessage("Last name is required")
    .trim()
    .escape(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .trim()
    .escape(),
  body("email").isEmail().trim().escape(),
  body("email")
    .custom(value =>
      User.findOne({ email: value }).then(user => {
        if (user) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject("Email already exists");
        }
      })
    )
    .trim()
    .escape(),
  body("passwordConfirmation")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }

      // Indicates the success of this synchronous custom validator
      return true;
    })
    .trim()
    .escape(),

  (req, res, next) => {
    if (req.isAuthenticated()) res.json("Already logged in");
    else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) res.json(errors.array());
      else
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          if (err) return next(err);
          if (!req.body.picture) {
            req.body.picture = "https://i.pravatar.cc/700";
          }
          const { firstName, lastName, email, picture } = req.body;
          const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picture,
          });
          user.save(err => {
            if (err) return next(err);
            res.redirect("/");
          });
        });
    }
  },
];
