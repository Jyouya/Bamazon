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
            department: req.query.department,
            sort: {
                direction: req.query.sort_direction, // validate or default ascending
                type: req.query.sort_type || 'popularity'
            }
        }

        // let out;
        // if (search) {
        out = await db.Product.findAll({
            include: [
                {
                    model: db.Order,
                    // as: 'popularity',
                    where: {
                        createdAt: {
                            [Op.gte]: moment().subtract(7, 'days').toDate()
                        }
                    },
                    group: ['productId'],
                    attributes: [[sequelize.fn('sum', sequelize.col('quantity')), 'popularity']]
                }
            ],
            // where: {
            //     [Op.like]: `%${options.query}%`
            // },
            order: [sequelize.fn('sum', sequelize.col('quantity'))]
        })
        // } else {

        // }
        res.json(out);


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
        const hash = await scryptP(req.body.password, user.salt, 256)
        console.log(hash);
        if (hash !== user.hash.toString()) {
            return res.send('Username or Password is incorrect').end();
        }

        res.status(200).send('Credentials accepted').end();


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