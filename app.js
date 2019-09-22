//Imports the express module
const express = require('express');

//Imports bodyParser, a Node.js body parsing middleware. It parse incoming
//request bodies in a middleware before your handlers, available under the
//req.body property. Adapted from https://www.npmjs.com/package/body-parser.
const bodyParser = require("body-parser");

//A top-level function exported by the express module
//Adapted from: https://freshman.tech/learn-node/
const app = express();

//Requires my Sequelize models and ORM from the models folder.
const db = require('./models');

//Requires my Book model from my db object. This allows me to access my Book model
//so I can create and read from my database.
//Adapted from: https://gist.github.com/vapurrmaid/a111bf3fc0224751cb2f76532aac2465
const Book = db.Book;

//bodyParser() allows form data to be available in req.body. The middleware to handle
//url encoded data is returned by this bodyParser method.
//Adapted from: https://www.npmjs.com/package/body-parser
app.use(bodyParser.urlencoded({ extended: false }));


//bodyParser.json() returns middleware that only parses json. This parser
//accepts any Unicode encoding of the body. A new body object containing the
//parsed data is populated on the request object after the middleware (i.e. req.body).
//Adapted from: https://www.npmjs.com/package/body-parser.
app.use(bodyParser.json())

//Specifies where static files for my website are located, so that express
//can serve them correctly.
app.use('/static', express.static('public'));

//Designates pug as my template engine.
app.set('view engine', 'pug');

//Here I specify that when a request is made to the root of my website, the user
//should be redirected to the '/books' path.
app.get('/', (req, res) => {
  res.redirect('/books');
});

//Here I use an async function, so that I can retrieve all books from my database
//using a Sequelize operator. On my index page, I need to display all books in
//ascending order by title, so I've used the order object to ensure that the books
//are retrieved in the correct order.
//In my res.render functon, I specify that the index.pug template should be
//rendered and 'bookList' handed down to the template as 'books'.
app.get('/books', async (req, res, next) => {
  const bookList = await Book.findAll({
    order: [
      ['title', 'ASC']
    ]
  });
  res.render('index', { books: bookList });
});

//Here I specify that when a request is made to ''/books/new' route,
//the new-book.pug template should be rendered with my new book form.
app.get('/books/new', (req, res) => {
  res.render('new-book');
});

//In my post method to the 'books/new' route, I use a try catch block within my
//async function, so that I can 'catch' any errors. First, in my try block, I
//I set the body of my request to the constant 'request'. Then I create a new Book
//instance with the attributes in the request body. Then I redirect the user to
//the individual book's show page.

//In my catch block, I write a conditional where if the error thrown is
//a Sequelize validation error, then I map over the error objects in the error
//and save them in the array 'errorMessages.' Then I render the 'new-book' pug
//template and hand down the 'errorMessages' to be displayed to the user.
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

//In my '/books/:id' route, first I retrieve the book by its ID with the Sequelize
//findbyPk() (find by primary key) operation. If the book is equal to null (ie. the
//primary key does not exist), I render the 'error' pug template. If the book
//is not null and is in the database, I render the 'update-book' pug template
//and hand it down the book variable.
app.get('/books/:id', async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book === null) {
    res.render('error')
  } else {
    res.render('update-book', { book: book });
  }
});

//In my post method to the 'books/:id' route, I have adapted the try catch block
//from my 'books/new' route. In my try block, I find the book to be updated by its
//primary key and set it to the variable 'book'. Then I update that specific book
//with the Sequelize update operation.
//In my catch block, I find the book to be updated by its primary key and set it
//to the variable 'book'. Then I render the 'update-book' pug template and hand
//it the 'book' and 'errorMessages' to be displayed to the user.
app.post('/books/:id', async (req, res, next) => {
  try {
    const request = req.body
    const book = await Book.findByPk(req.params.id);
    await book.update(request);
    res.redirect('/books/' + book.id)
 } catch(error) {
   if (error.name === 'SequelizeValidationError') {
     const request = req.body
     const book = await Book.build(request);
     const errorMessages = error.errors.map(error => (error));
     res.render('update-book', { book, errorMessages });
   }
 }
});

//In my '/books/:id/delete' route, I can simply find the book to be deleted by
//its primary key taken from the url through req.params.id. Then I can delete
//it from the database with the Sequelize destroy() operation. Finally, I redirect
//the user to the '/books' route.
app.post('/books/:id/delete', async (req, res) => {
  const bookToDelete = await Book.findByPk(req.params.id);
  await bookToDelete.destroy();
  res.redirect('/books');
});

// This middleware is responsible for 1) creating an error object, 2) setting the
//error status to 404, and then handing it off to the error handler.
//Code adapted from the Team Treehouse Express Basics course (Handling 404 Errors
//video).
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//This Error Middleware creates a custom error handler to render a custom error
//template back to the client and format the error to be more readable.
//Code adapted from the Team Treehouse Express Basics course (Error Handling
//Middleware video).
app.use((err, req, res, next) => {
  res.locals.error = err;
  console.log(err)
  res.render('page-not-found');
});

//Sets up the website to run on Port 3000 (You can choose a number of different
//ports).
//After the server starts, db.sequelize.sync is invoked, this will automatically
//synchronize your application with the database.
//Adapted from: https://gist.github.com/vapurrmaid/a111bf3fc0224751cb2f76532aac2465
app.listen(3000, function() {
  db.sequelize.sync();
});
