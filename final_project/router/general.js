const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

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
public_users.get('/books-data', (req, res) => {
    res.json(books);
});

public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(
            'http://localhost:5000/books-data'
        );

        return res.send(
            JSON.stringify(response.data, null, 2)
        );

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});

public_users.get('/books-data/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.json(books[isbn]);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    //Write your code here
    try {
        const isbn = req.params.isbn;

        const response = await axios.get(
            `http://localhost:5000/books-data/${isbn}`
        );

        return res.send(JSON.stringify(response.data, null, 2));

    } catch (error) {
        return res.status(404).json({
            message: "Book not found"
        });
    }
   });

   // Internal endpoint for retrieving books by author
public_users.get('/books-data/author/:author', (req, res) => {
    const author = decodeURIComponent(req.params.author);
    const keys = Object.keys(books);
    const result = [];

    keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result.push(books[key]);
        }
    });

    return res.json(result);
});
  
// Get book details based on author

public_users.get('/author/:author', async function (req, res) {
    try {
        const author = encodeURIComponent(req.params.author);

        const response = await axios.get(
            `http://localhost:5000/books-data/author/${author}`
        );

        return res.send(JSON.stringify(response.data, null, 2));

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by author",
            error: error.message
        });
    }
});

public_users.get('/books-data/title/:title', (req, res) => {
    const title = req.params.title;

    const keys = Object.keys(books);
    const result = [];

    keys.forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            result.push(books[key]);
        }
    });

    return res.json(result);
});

// Get all books based on title
// Task 13: Get books by title using Axios and async/await
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = encodeURIComponent(req.params.title);

        const response = await axios.get(
            `http://localhost:5000/books-data/title/${title}`
        );

        return res.send(JSON.stringify(response.data, null, 2));

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by title",
            error: error.message
        });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;

    res.send(JSON.stringify(books[isbn].reviews, null, 2));
});

module.exports.general = public_users;
