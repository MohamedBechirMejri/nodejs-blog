const express = require("express");

const router = express.Router();

const {
  index,
  show,
  create,
  update,
  deleteArticle,
} = require("../controllers/article");

router.get("/", index);

router.post("/", create);

router.get("/:id", show);

router.put("/:id", update);

router.delete("/:id", deleteArticle);

module.exports = router;
