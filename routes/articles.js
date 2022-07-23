const express = require("express");

const router = express.Router();

const {
  index,
  show,
  create,
  update,
  deleteArticle,
  like,
  // unlike,
  comment,
  // deleteComment,
  // publish,
  // unpublish,
  bookmark,
  // unbookmark,
  // search,
} = require("../controllers/article");
const verifyToken = require("../Middlewares/Auth/verifyToken");

router.get("/", index);

router.post("/", verifyToken, create);

router.get("/:id", verifyToken, show);

router.put("/:id", verifyToken, update);

router.delete("/:id", verifyToken, deleteArticle);

router.post("/:id/like", verifyToken, like);

router.post("/:id/bookmark", verifyToken, bookmark);

router.post("/:id/comment", verifyToken, comment);

module.exports = router;
