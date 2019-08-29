module.exports = function (sequelize, DataTypes) {
    const Product = sequelize.define('Product', {
        product_name: DataTypes.STRING,
        price: DataTypes.DECIMAL(7,2),
        stock_quantity: DataTypes.INTEGER,
        img: DataTypes.STRING
    });

    // Has many orders
    Product.associate = function(models) {
        Product.belongsToMany(models.Order, {
            through: models.ProductOrder,
            foreignKey: 'productId'
        });
        Product.belongsTo(models.Department, {
            foreignKey: 'departmentId'
        });
    }

    return Product;
}