const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator(v) {
          return /^(([^<>()\\[\].,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          );
        },
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
      validate: {
        validator(v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/.test(
            v
          );
        },
      },
    },
    picture: {
      type: String,
      required: true,
      default: "https://picsum.photos/200/300",
    },
    role: {
      type: String,
      enum: ["admin", "user", "editor"],
      default: "user",
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
  },
  { timestamps: true }
);

userSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = model("User", userSchema);
