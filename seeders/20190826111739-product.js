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
        updatedAt: new Date(),
        img: 'https://via.placeholder.com/200'
      },
      {
        product_name: 'Gadget',
        price: 4.99,
        stock_quantity: 20,
        departmentId: 1, // Home
        createdAt: new Date(),
        updatedAt: new Date(),
        img: 'https://via.placeholder.com/200'
      },
      {
        product_name: 'Foo',
        price: 5.99,
        stock_quantity: 10,
        departmentId: 2, // Bath
        createdAt: new Date(),
        updatedAt: new Date(),
        img: 'https://via.placeholder.com/200'
      },
      {
        product_name: 'Bar',
        price: 6.99,
        stock_quantity: 20,
        departmentId: 3, // Electronics
        createdAt: new Date(),
        updatedAt: new Date(),
        img: 'https://via.placeholder.com/200'
      },
      {
        product_name: 'Shirt',
        price: 9.99,
        stock_quantity: 40,
        departmentId: 4, // Men's
        createdAt: new Date(),
        updatedAt: new Date(),
        img: 'https://via.placeholder.com/200'
      }, {
        product_name: 'Dress',
        price: 29.99,
        stock_quantity: 20,
        departmentId: 5, // Women's
        createdAt: new Date(),
        updatedAt: new Date(),
        img: 'https://via.placeholder.com/200'
      }, {
        product_name: 'Yuzz-a-ma-Tuzz',
        price: 10.95,
        stock_quantity: 5,
        departmentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        img: 'https://via.placeholder.com/200'
      }, {
        product_name: 'Wumbus',
        price: 8.49,
        stock_quantity: 8,
        departmentId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        img: 'https://via.placeholder.com/200'
      }, {
        product_name: 'Umbus',
        price: 3.37,
        stock_quantity: 20,
        departmentId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        img: 'https://via.placeholder.com/200'
      }, {
        product_name: 'Flunnel',
        price: 19.99,
        stock_quantity: 10,
        departmentId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        img: 'https://via.placeholder.com/200'
      }, {
        product_name: 'Nutches',
        price: 14.00,
        stock_quantity: 20,
        departmentId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
        img: 'https://via.placeholder.com/200'
      }, {
        product_name: 'Thnadner',
        price: 5.95,
        stock_quantity: 20,
        departmentId: 5, // Women's
        createdAt: new Date(),
        updatedAt: new Date(),
        img: 'https://via.placeholder.com/200'
      }
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
