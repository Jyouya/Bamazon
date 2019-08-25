'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Departments', [
      {
        department_name: 'Home',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        department_name: 'Bath',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        department_name: 'Electronics',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        department_name: 'Men\'s Clothing',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        department_name: 'Women\'s Clothing',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Departments', null, {});
  }
};
