'use strict';
//This is also a file partially auto-generated through Sequelize CLI. If I were
//to begin this project with a completely blank database, I could use this seeder
//file to give my project some 'seed' data entries.
//I found this Github gist tutorial quite helpful in creating and running my seed files:
//https://gist.github.com/vapurrmaid/a111bf3fc0224751cb2f76532aac2465
//Basically, to create this file, you run the command 'sequelize seed:create --name my-seed-file'
//in your terminal. Then you edit this auto-generated file to write your own
//seed files. Then you run the 'sequelize db:seed:all' command in your terminal
//to seed your database. 

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
