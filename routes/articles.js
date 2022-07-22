const express = require("express");

const router = express.Router();

const {
  index,
  show,
  create,
  update,
  deleteArticle,
} = require("../controllers/article");
const verifyToken = require("../Middlewares/Auth/verifyToken");

router.get("/", index);

router.post("/", verifyToken, create);

router.get("/:id", show);

router.put("/:id", verifyToken, update);

router.delete("/:id", verifyToken, deleteArticle);

module.exports = router;
