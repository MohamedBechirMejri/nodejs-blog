/* eslint-disable no-console */
require("dotenv").config();

const mongoose = require("mongoose");
const async = require("async");

const Category = require("./models/Category");
const Article = require("./models/Article");
const User = require("./models/User");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const categories = [];
const users = [];

const createCategory = (name, cb) => {
  const category = new Category({ name });
  category.save((err, c) => {
    if (err) {
      console.log(err);
    }
    categories.push(c);
    cb(null, c);
  });
};

const createUser = (firstName, lastName, email, cb) => {
  const user = new User({
    firstName,
    lastName,
    email,
    picture: "https://picsum.photos/1000",
  });
  user.save((err, s) => {
    if (err) {
      console.log(err);
    }
    users.push(s);
    cb(null, s);
  });
};

const createArticle = (title, body, cb) => {
  const item = new Article({
    title,
    body,
    image: "https://picsum.photos/1000",
    author: users[Math.floor(Math.random() * users.length)]._id,
    category: categories[Math.floor(Math.random() * categories.length)]._id,
  });
  item.save((err, i) => {
    if (err) {
      console.log(err);
    }
    console.log(i);
    cb(null, i);
  });
};

const populateCategories = callback => {
  async.series(
    [
      cb => {
        createCategory("Phones", cb);
      },
      cb => {
        createCategory("Electronics", cb);
      },
      cb => {
        createCategory("Clothing", cb);
      },
      cb => {
        createCategory("Movies", cb);
      },
      cb => {
        createCategory("Games", cb);
      },
      cb => {
        createCategory("Toys", cb);
      },
      cb => {
        createCategory("Sports", cb);
      },
      cb => {
        createCategory("Automotive", cb);
      },
      cb => {
        createCategory("Home", cb);
      },
      cb => {
        createCategory("Tools", cb);
      },
      cb => {
        createCategory("Other", cb);
      },
    ],
    callback
  );
};

const populateUsers = callback => {
  async.series(
    [
      cb => {
        createUser("John", "Doe", "john.doe@test.com", cb);
      },
      cb => {
        createUser("Jane", "Doe", "jane.doe@test.com", cb);
      },
      cb => {
        createUser("Jack", "Doe", "jack.doe@test.com", cb);
      },
      cb => {
        createUser("Jill", "Doe", "jill.doe@test.com", cb);
      },
      cb => {
        createUser("Juan", "Doe", "juan.doe@test.com", cb);
      },
      cb => {
        createUser("Juanita", "Doe", "juanita.doe@test.com", cb);
      },
    ],
    callback
  );
};

const populateArticles = callback => {
  async.series(
    [
      cb => {
        createArticle("iPhone X", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle("iPhone XS", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle("iPhone XS Max", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle("iPhone XR", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle("iPhone 11", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle("iPhone 11 Pro", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle(
          "iPhone 11 Pro Max",
          "The newest iPhone in the world",
          cb
        );
      },
      cb => {
        createArticle("iPhone SE", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle("iPhone 12", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle("iPhone 12 Pro", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle(
          "iPhone 12 Pro Max",
          "The newest iPhone in the world",
          cb
        );
      },
      cb => {
        createArticle("iPhone 13", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle("iPhone 13 Pro", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle(
          "iPhone 13 Pro Max",
          "The newest iPhone in the world",
          cb
        );
      },
      cb => {
        createArticle("iPhone 14", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle("iPhone 14 Pro", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle(
          "iPhone 14 Pro Max",
          "The newest iPhone in the world",
          cb
        );
      },
      cb => {
        createArticle("iPhone 15", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle("iPhone 15 Pro", "The newest iPhone in the world", cb);
      },
      cb => {
        createArticle(
          "iPhone 15 Pro Max",
          "The newest iPhone in the world",
          cb
        );
      },
    ],
    callback
  );
};

async.series([populateCategories, populateUsers, populateArticles]);
