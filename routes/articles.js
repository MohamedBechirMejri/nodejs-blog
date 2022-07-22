const express = require("express");

const router = express.Router();

const {
  index,
  show,
  create,
  //   update,
  //   deletePost,
} = require("../controllers/article");

router.get("/", index);

router.post("/", create);

router.get("/:id", show);

// router.post("/:id/edit", update);

// router.post("/:id/delete", delete);

module.exports = router;
