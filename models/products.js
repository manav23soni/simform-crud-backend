'use strict';

const _ = require('lodash');

const modelConstants = require('../constants/model');

module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      index: true,
      allowNull: false,
    },
  }, {});
  products.associate = (models) => {
    products.belongsTo(models.users, { foreignKey: 'userId' });
  };
  return products;
};
