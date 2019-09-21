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
  const bookList = await Book.findAll({
    order: [
      ['title', 'ASC']
    ]
  });
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
     const errorMessages = error.errors.map(error => (error));
     res.render('new-book', { errorMessages });
   }
 }
});

app.get('/books/:id', async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book === null) {
    res.render('error')
  } else {
    res.render('update-book', { book: book });
  }
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
     const errorMessages = error.errors.map(error => (error));
     res.render('update-book', { book, errorMessages });
   }
 }
});

app.post('/books/:id/delete', async (req, res) => {
  const bookToDelete = await Book.findByPk(req.params.id);
  await bookToDelete.destroy();
  res.redirect('/books');
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  console.log(err)
  res.render('page-not-found');
});

app.listen(3000, function() {
  db.sequelize.sync();
});
