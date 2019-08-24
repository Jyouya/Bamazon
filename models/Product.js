module.exports = function (sequelize, DataTypes) {
    const Product = sequelize.define('Product', {
        product_name: DataTypes.STRING,
        department_name: DataTypes.STRING,
        price: DataTypes.DECIMAL(2),
        stock_quantity: DataTypes.INTEGER
    });

    // Has many orders
    Product.associate = function(models) {
        Product.belongsToMany(models.Order, {
            through: models.ProductOrder,
            foreignKey: 'productId'
        })
    }

    return Product;
}