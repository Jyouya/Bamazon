module.exports = function(sequelize, DataTypes) {
    // The join table for products and orders
    const ProductOrder = sequelize.define('ProductOrder', {
        quantity: DataTypes.INTEGER
    })
    return ProductOrder;
}