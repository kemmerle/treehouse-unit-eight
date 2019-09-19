const express = require('express');
const app = express();

const db = require('./models');
const Book = db.Book;

app.use('/static', express.static('public'));

app.set('view engine', 'pug');

app.get('/', (req, res) => {
      res.redirect('/books');
});

app.get('/books', async (req, res, next) => {
  const books = await Book.findAll();
  const bookList = books.map(book => book.toJSON());

  res.render('index', { books: bookList });
});

app.listen(3000, function() {
  db.sequelize.sync();
});
