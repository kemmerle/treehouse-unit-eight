const express = require('express');
const bodyParser = require("body-parser");
const app = express();

const db = require('./models');
const Book = db.Book;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json())

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

app.get('/books/new', (req, res) => {
  res.render('new-book');
});

app.post('/books/new', async (req, res, next) => {
  try {
    const request = req.body
    const book = await Book.create(request);
    res.redirect('/books/' + book.id)
 } catch(error) {
   if (error.name === 'SequelizeValidationError') {
     const messages = error.errors.map(err => (err));
     res.render('new-book', { messages });
   }
 }
});

app.get('/books/:id', async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  res.render('show', { book: book });
});

app.get('/books/edit/:id', async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', { book: book });
});

app.post('/books/:id', async (req, res, next) => {
  try {
    const request = req.body
    const book = await Book.findByPk(req.params.id);
    await book.update(request);
    res.redirect('/books/' + book.id)
 } catch(error) {
   if (error.name === 'SequelizeValidationError') {
     const book = await Book.findByPk(req.params.id);
     const messages = error.errors.map(err => (err));
     res.render('update-book', { book, messages });
   }
 }
});

app.post('/books/:id/delete', async (req, res) => {
  const bookToDelete = await Book.findByPk(req.params.id);
  await bookToDelete.destroy();
  res.redirect('/books');
});

app.listen(3000, function() {
  db.sequelize.sync();
});
