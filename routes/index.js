const express = require("express");

const router = express.Router();

const { signup, login } = require("../controllers/auth");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.json("hello world");
});

router.post("/signup", signup);

router.post("/login", login);

module.exports = router;
