const _ = require('lodash');
const jwt = require('jsonwebtoken');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const logger = require('../helper/logger');
const Model = require('../models/index');

const {
  ERROR401,
  ERROR400,
} = require('../constants/common');

const auth = {};

// Authenticate user by token
auth.isAuthenticatedUser = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) {
    return res.status(ERROR401.CODE).json({
      error: req.t('PERMISSION_ERROR'),
      code: ERROR401.CODE,
    });
  }
  const userData = jwt.verify(token, process.env.PRIVATE_KEY);
  if (!userData.userId) {
    return res.status(ERROR401.CODE).json({
      error: req.t('PERMISSION_ERROR'),
      code: ERROR401.CODE,
    });
  }
  
  Model.users.findOne({
    where: {
      id: userData.userId,
    },
  }).then((user) => {
    req.authUserDetails = user;
    if (!_.isEmpty(user)) {
      return next();
    }
    if (user) {
      return res.status(ERROR401.CODE).json({
        error: req.t('ERR_USER_NOT_FOUND'),
        code: ERROR401.CODE,
      });
    }
  }).catch(() => {
    return res.status(ERROR401.CODE).json({
      error: req.t('PERMISSION_ERROR'),
      code: ERROR401.CODE,
    });
  });
};

module.exports = auth;
