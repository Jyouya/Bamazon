module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('User', {
        type: DataTypes.STRING,
        username: DataTypes.STRING,
        hash: DataTypes.BLOB, //STRING gave errors since the binary strings weren't valid utf-8
        salt: DataTypes.BLOB
    });

    return User;
}