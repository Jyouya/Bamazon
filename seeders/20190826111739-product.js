'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [
      {
        product_name: 'Widget',
        price: 3.99,
        stock_quantity: 20,
        departmentId: 1, // Home
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Gadget',
        price: 4.99,
        stock_quantity: 20,
        departmentId: 1, // Home
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_name: 'Foo',
        price: 5.99,
        stock_quantity: 10,
        departmentId: 2, // Bath
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_name: 'Bar',
        price: 6.99,
        stock_quantity: 20,
        departmentId: 3, // Electronics
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_name: 'Shirt',
        price: 9.99,
        stock_quantity: 40,
        departmentId: 4, // Men's
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        product_name: 'Dress',
        price: 29.99,
        stock_quantity: 20,
        departmentId: 5, // Women's
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
