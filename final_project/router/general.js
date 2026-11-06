const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check missing username or password
  if (!username || !password) {
      return res.status(400).json({
          message: "Username and password are required"
      });
  }

  // Check if username already exists
  if (isValid(username)) {
      return res.status(409).json({
          message: "Username already exists"
      });
  }

  // Register new user
  users.push({
      username: username,
      password: password
  });

  return res.status(200).json({
      message: "User successfully registered"
  });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn], null, 2));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
    const keys = Object.keys(books);
    let result = [];

    keys.forEach((key) => {
        if (books[key].author === author) {
            result.push(books[key]);
        }
    });

    res.send(JSON.stringify(result, null, 2));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
    const keys = Object.keys(books);
    let result = [];

    keys.forEach((key) => {
        if (books[key].title === title) {
            result.push(books[key]);
        }
    });

    res.send(JSON.stringify(result, null, 2));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;

    res.send(JSON.stringify(books[isbn].reviews, null, 2));
});

module.exports.general = public_users;
