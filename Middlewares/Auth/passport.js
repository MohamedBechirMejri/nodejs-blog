/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      User.findOne({ email }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: "Incorrect email" });

        bcrypt.compare(password, user.password, (err, res) => {
          if (err) return done(err);
          if (!res) return done(null, false, { message: "Incorrect password" });
          return done(null, user);
        });
      });
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

module.exports = passport;
