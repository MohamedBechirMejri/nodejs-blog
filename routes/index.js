const express = require("express");

const router = express.Router();

const { signup, login } = require("../controllers/auth");
const { index } = require("../controllers/category");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.json("hello world");
});

router.post("/signup", signup);

router.post("/login", login);

router.get("/categories", index);

module.exports = router;
