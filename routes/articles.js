const express = require("express");

const router = express.Router();

const {
  index,
  show,
  //   createGet,
  //   createPost,
  //   updateGet,
  //   updatePost,
  //   deleteGet,
  //   deletePost,
} = require("../controllers/article");

router.get("/", index);

// router.get("/create", createGet);

// router.post("/create", createPost);

router.get("/:id", show);

// router.get("/:id/edit", updateGet);

// router.post("/:id/edit", updatePost);

// router.get("/:id/delete", deleteGet);

// router.post("/:id/delete", deletePost);

module.exports = router;
