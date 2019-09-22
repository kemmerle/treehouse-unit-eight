'use strict';

//In my Book model, I initialize my Book with four attributes: title, author,
//genre, and year; all of these attributes are strings except for year, an integer.
//For my title and author attributes, I have also added the validate object, so
//that I can specify that the title and author attributes cannot be null or
//empty strings. I have also added personal error messages with the msg variable.

//Because I used Sequelize CLI to set up my models and migrations, my book model
//was auto-generated with the assocations in place. I will need to use this
//in Project 9 but not here. 
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a title',
        },
        notEmpty: {
          msg: 'Please provide a title',
        },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide an author name',
        },
        notEmpty: {
          msg: 'Please provide an author name',
        },
      },
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};
