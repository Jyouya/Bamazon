module.exports = function(sequelize, DataTypes) {
    // 
    const Order = sequelize.define('Order', {
        item: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
    })

    // Belongs to many products
    Order.associate = function(models) {
        Order.belongsTo(models.)
    }
}