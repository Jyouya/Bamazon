const path = require('path');


module.exports = function(app, express) {
    app.use(express.static(path.join(__dirname, '../public')));
    app.get('/product', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/product.html'))
    });
    // make route for /products?id=12345
}
