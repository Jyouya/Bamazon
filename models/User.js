module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('User', {
        type: DataTypes.STRING,
        username: DataTypes.STRING,
        hash: DataTypes.BLOB,
        salt: DataTypes.BLOB
    });

    return User;
}