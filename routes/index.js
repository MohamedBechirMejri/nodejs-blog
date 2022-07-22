const express = require("express");

const router = express.Router();

const { signup, login, logout } = require("../controllers/auth");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.json("hello world");
});

router.post("/signup", signup);

router.post("/login", login);

router.get("/logout", logout);

module.exports = router;
