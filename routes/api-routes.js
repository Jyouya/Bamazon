const db = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const moment = require('moment');
const { promisify } = require('util')
const crypto = require('crypto');
const scryptP = promisify(crypto.scrypt);
const randomBytesP = promisify(crypto.randomBytes);


module.exports = function (app) {
    // Endpoint lets you:
    // - search
    // - get all products

    app.get('/api/products', async function (req, res) {
        console.log(req.query);
        const search = req.query.q; // Boolish we're searching
        const options = {
            n: req.query.n || 20,
            page: req.query.page || 1,
            query: req.query.q,
            department: req.query.department, // accept ID or Name, convert to name here
            sort: {
                direction: (req.query.sortDirection && req.query.sortDirection.toLowerCase()) === 'asc' ? 'ASC' : 'DESC',
                type: req.query.sortType || 'popularity'
            }
        }

        let out;
        // if (search) {
        out = await db.sequelize.query(
            `WITH popularity AS (
                    SELECT productorders.productId, SUM(quantity) AS popularity
                        FROM orders
                        INNER JOIN productorders
                            ON orders.id = productorders.orderId
                        JOIN products
                            ON products.id = productorders.productId
                        WHERE orders.createdAt > NOW() - INTERVAL 1 WEEK
                        GROUP BY productorders.productId
                )
                SELECT products.product_name AS name, price, products.id, departments.department_name AS department, departments.id as department_id
                    FROM popularity
                    RIGHT JOIN products
                        ON products.id = popularity.productID
                    JOIN departments
                        ON products.departmentId = departments.id
                        ${search ? `WHERE products.product_name LIKE :q
                            ${options.department ? 'AND' : ''}` : ''}
                        ${options.department ? `${search ? '' : 'WHERE'} 
                            departments.department_name LIKE :department
                            OR departments.id = :departmentRaw` : ''}
                    ORDER BY popularity ${options.sort.direction}`,
            {
                replacements: {
                    q: `%${options.query}%`,
                    department: `%${options.department}%`,
                    departmentRaw: options.department
                },
                type: db.sequelize.QueryTypes.SELECT
            });
        res.json(out);
        // }

        // let out;
        // if (search) {
        // out = await db.Product.findAll({
        //     include: [
        //         {
        //             model: db.Order,
        //             // as: 'popularity',
        //             // where: {
        //             //     createdAt: {
        //             //         [Op.gte]: moment().subtract(7, 'days').toDate()
        //             //     }
        //             // },
        //             // group: ['productId'],
        //             // attributes: [[sequelize.fn('sum', sequelize.col('quantity')), 'popularity']]
        //         },
        //         {
        //             model: db.Department,
        //             attributes: [['id', 'departmentId'], 'department_name']
        //         }
        //     ],
        //     // where: {
        //     //     [Op.like]: `%${options.query}%`
        //     // },
        //     // order: [sequelize.fn('sum', sequelize.col('quantity'))],
        // })
        // } else {

        // }
        // res.json(out);


    });

    app.get('/api/products/:product', function (req, res) {

    });

    // Add new products
    app.post('/api/products', async function (req, res) {
        // pull up the user
        console.log(req.body.username);
        user = await db.User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (!user) {
            return res.send('Username or Password is incorrect').end();
        }
        const hash = await scryptP(req.body.password, user.salt, 256);
        console.log(hash);
        if (hash != user.hash.toString()) {
            return res.send('Username or Password is incorrect').end();
        }

        // res.status(200).send('Credentials accepted');

        res.json(await db.Product.create({
            product_name: req.body.name,
            departmentId: req.body.department,
            price: req.body.price,
            stock_quantity: req.body.stock || 0
        }))

    });

    // Create a new user
    app.post('/api/users', async function (req, res) {
        console.log(req.body);
        if (await db.User.findOne({
            where: {
                username: req.body.username
            }
        })) {
            return res.send('Username already exists').end();
        }
        const salt = await randomBytesP(256);
        const hash = await scryptP(req.body.password, salt, 256);
        await db.User.create({
            username: req.body.username,
            hash: hash,
            salt: salt,
            type: req.body.type || 'customer'
        });
        res.status(200).send('Account created successfuly').end();
    })

}