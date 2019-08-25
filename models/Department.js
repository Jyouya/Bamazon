module.exports = function(sequelize, DataTypes) {
    const Department = sequelize.define('Department', {
        department_name: DataTypes.STRING
    });

    // Department.associate = function(models) {
    //     Department.hasMany(models.Product)
    // } 

    return Department;
}