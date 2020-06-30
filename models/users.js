'use strict';

const _ = require('lodash');

const modelConstants = require('../constants/model');

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {});
  users.associate = (models) => {
    // associations can be defined here
  };
  return users;
};
