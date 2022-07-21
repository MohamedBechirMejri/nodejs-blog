const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

articleSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

articleSchema.virtual("url").get(function () {
  return `/articles/${this._id}`;
});

module.exports = model("Article", articleSchema);
