'use strict';

module.exports = (sequelize, DataTypes) => {
  const routes = sequelize.define('routes', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    routeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parameters: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
  }, {});
  routes.associate = (models) => {
    routes.belongsTo(models.users, { foreignKey: 'userId' });
  };
  return routes;
};
