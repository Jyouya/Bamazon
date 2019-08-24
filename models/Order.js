module.exports = function(sequelize, DataTypes) {
    // 
    const Order = sequelize.define('Order', {
        total: DataTypes.DECIMAL(7,2) // 9 digits to 4 bytes!
    });

    // Belongs to many products
    Order.associate = function(models) {
        Order.belongsToMany(models.Product, {
            through: models.ProductOrder,
            foreignKey: 'orderId'
        })
    }

    return Order;
}