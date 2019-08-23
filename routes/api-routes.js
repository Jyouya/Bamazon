db = require('../models');
Op = require('sequelize').Op;
module.exports = function(app) {
    // Endpoint lets you:
    // - search
    // - get all products

    app.get('/api/products', async function(req, res) {
        console.log(req.query);
        const search = res.query.q; // Boolish we're searching
        const options = {
            n: res.query.n || 20,
            page: res.query.page || 1,
            query: res.query.q || null,
            sort: {
                direction: res.query.sort_direction, // validate or default ascending
                type: res.query.sort_type || 'popularity'
            }
        }


        let out;
        if (search) {
            out = await db.Product.findAll({
                where: {
                    [Op.like]: `%${options.query}%`
                }
            })
        } else {

        }


    });
    app.get('/api/products/:product', function(req, res) {

    });
}