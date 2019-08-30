const db = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const moment = require('moment');
const { promisify } = require('util')
const crypto = require('crypto');
const scryptP = promisify(crypto.scrypt);
const randomBytesP = promisify(crypto.randomBytes);


module.exports = function (app) {
    app.get('/api/products', async function (req, res) {
        console.log(req.query);
        const search = req.query.q; // Boolish we're searching
        const options = {
            n: Math.min(Math.max(req.query.n || 20, 1), 50),
            page: req.query.page || req.query.p || 1,
            query: req.query.q || req.query.query,
            department: req.query.department || req.query.dpt, // accept ID or Name, convert to name here
            sort: {
                direction: (req.query.sortDirection && req.query.sortDirection.toLowerCase()) === 'asc' ? 'ASC' : 'DESC',
                type: req.query.sortBy || 'popularity'
            }
        }

        let out;
        // if (search) {
        out = await db.sequelize.query(
            `WITH popularity AS (
                    SELECT ProductOrders.ProductId, SUM(quantity) AS popularity
                        FROM Orders
                        INNER JOIN ProductOrders
                            ON Orders.id = ProductOrders.orderId
                        JOIN Products
                            ON Products.id = ProductOrders.ProductId
                        WHERE Orders.createdAt > NOW() - INTERVAL 1 WEEK
                        GROUP BY ProductOrders.ProductId
                )
                SELECT Products.product_name AS name, price, Products.id, Departments.department_name AS department, Departments.id as department_id, Products.img as img
                    FROM popularity
                    RIGHT JOIN Products
                        ON Products.id = popularity.productId
                    JOIN Departments
                        ON Products.departmentId = Departments.id
                        ${search ? `WHERE Products.product_name LIKE :q
                            ${options.department ? 'AND' : ''}` : ''}
                        ${options.department ? `${search ? '' : 'WHERE'} 
                            Departments.department_name LIKE :department
                            OR Departments.id = :departmentRaw` : ''}
                    ORDER BY popularity ${options.sort.direction}
                    LIMIT :n OFFSET :p`,
            {
                replacements: {
                    q: `%${options.query}%`,
                    department: `%${options.department}%`,
                    departmentRaw: options.department,
                    n: options.n,
                    p: options.page - 1
                },
                type: db.sequelize.QueryTypes.SELECT
            });
        res.json(out);
    });

    app.get('/api/products/:product', async function (req, res) {
        product = await db.Product.findOne({
            where: {
                id: req.params.product
            },
            include: [
                {
                    model: db.Department,
                    attributes: [['department_name','name']]
                }
            ],
            //SELECT products.product_name AS name, price, products.id, departments.department_name AS department, departments.id as department_id
            attributes: [['product_name', 'name'], 'price', 'id', ['stock_quantity', 'stock'], 'img']
        });

        res.json(product);
    });

    // Add new products
    app.post('/api/products', async function (req, res) {

        const user = await authenticate(req.body.username, req.body.password);

        if (!user) {
            return res.send('Username or Password is incorrect');
        }

        res.json(await db.Product.create({
            product_name: req.body.name,
            departmentId: req.body.department,
            price: req.body.price,
            stock_quantity: req.body.stock || 0,
            img: req.body.img
        }));

    });

    // Restock
    app.put('/api/products', async function (req, res) {
        const user = authenticate(req.body.username, req.body.password);
        if (!user) {
            return res.send('Username or Password is incorrect')
        }
        res.json(await db.Product.update(
            {
                product_name: req.body.name,
                departmentId: req.body.department,
                price: req.body.price,
                stock_quantity: req.body.stock || 0,
            },
            {
                where: {
                    id: req.body.id
                }
            }
        ));
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
    });

    // Place an order
    app.post('/api/orders', async function (req, res) {
        try {
            // return console.log(req.body);
            // const data = JSON.parse(req.body);
            const order = await Promise.all(req.body.map(async function (product) {
                const p = await db.Product.findOne({
                    where: {
                        id: product.id
                    },
                    attributes: ['price', ['stock_quantity', 'stock']]
                });
                if (p.dataValues.stock < product.quantity) {
                    throw "Insufficient Quantity"
                }
                return p;
            }));

            const total = order.reduce((a, b, i) => a + b.price * req.body[i].quantity, 0);

            // Don't need to wait for the result of this one, although if it fails, do we want the order to go through?
            req.body.forEach((product, i) => {
                db.Product.update({
                    stock_quantity: order[i].dataValues.stock - product.quantity
                },
                    {
                        where: {
                            id: product.id
                        }
                    }
                )
            });
            // Create an order
            const { id } = await db.Order.create({ total: total });

            res.json({
                orderId: id,
                total: total
            });

            // Add all of our products to the order through the ProductOrder model
            req.body.forEach(product => {
                db.ProductOrder.create({
                    productId: product.id,
                    orderId: id,
                    quantity: product.quantity
                })
            });

        } catch (err) {
            console.log(err);
            res.json({err:err});
        }
    });


}

async function authenticate(username = "", password = "") {
    const user = await db.User.findOne({
        where: {
            username: username
        }
    });
    const salt = await randomBytesP(256);

    if (!user) {
        // Need to perform a dummy hash to make username hits and misses take the same time
        const dummy = await scryptP(password, salt, 256).toString();
        return false;
    }
    const hash = await scryptP(password, user.salt, 256);
    if (hash != user.hash.toString()) {
        return false;
    }
    return user;
}