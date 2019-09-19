'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Books', [{
      title : 'Jane Eyre',
      author : 'Charlotte Bronte',
      genre : 'Classic British Literature',
      year: 1847,
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      title: 'Wuthering Heights',
      author: 'Emily Bronte',
      genre: 'Classic British Literature',
      year: 1847,
      createdAt : new Date(),
      updatedAt : new Date()
    },
    {
      title: 'Lavinia',
      author: 'Ursula Le Guin',
      genre: 'Science Fiction',
      year: 2008,
      createdAt : new Date(),
      updatedAt : new Date()
    }
  ], {});
  },

  down : function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Books', [{
      title : 'Jane Eyre'
    },
    {
      title : 'Wuthering Heights'
    },
    {
      title : 'Lavinia'
    }
  ])
  }
};
