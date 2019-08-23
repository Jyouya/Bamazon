module.exports = function (sequelize, DataTypes) {
    const Product = sequelize.define('Product', {
        product_name: DataTypes.STRING,
        department_name: DataTypes.STRING,
        price: DataTypes.DECIMAL(2),
        stock_quantity: DataTypes.INTEGER
    });

    // Has many orders
    Product.associate = function(models) {
        Product.hasMany()
    }

    return Product;
}