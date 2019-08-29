const path = require('path');


module.exports = function(app, express) {
    app.use(express.static(path.join(__dirname, '../public')));
    app.get('/product', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/product.html'));
    });
    app.get('/order', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/order.html'));
    })
    // make route for /products?id=12345
}
