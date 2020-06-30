const l10n = require('jm-ez-l10n');
const { check } = require('express-validator');

const userService = require('./userService');
const logger = require('../../../helper/logger');
const {
  ERROR409,
  ERROR500,
  ERROR401,
} = require('../../../constants/common');

const middleware = {};

middleware.userSignUpValidator = () => {
  return [
    check('name', l10n.t('ERROR_NAME_REQUIRED')).exists({ checkFalsy: true }),
    check('email', l10n.t('ERROR_EMAIL_REQUIRED')).isEmail(),
    check('password', 'Password should not be empty, minimum eight characters, one lowercase character, one uppercase character, a number, and a special character').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    ];
};

middleware.findUserByEmail = async (req, res, next) => {
    try {
        const data = await userService.readUserByEmail(req.body.email);
        if (data) {
            req.userData = data;
            return next();
        }
        return res.status(400).json({
            error: 'Invalid Credentials',
        });
    } catch (err) {
        logger.error('ERROR! From User-Middlware', err);
        return res.status(500).json({
            error: 'Internal Server Error',
        });
    }
};

middleware.userLoginValidator = () => {
  return [
    check('email', l10n.t('ERROR_EMAIL_REQUIRED')).isEmail(),
    check('password', l10n.t('ERROR_PASSWORD_REQUIRED')).exists({ checkFalsy: true }),
  ];
};

// Check if is user exists or not if exists then return (Find By emailId)
middleware.isUserExistsOrNot = async (req, res, next) => {
  try {
    const data = await userService.readUserByEmailId(req.body.email);
    if (!data || !data.email) {
      return res.status(ERROR401.CODE).json({
        error: req.t('ERR_USER_NOT_FOUND'),
        code: ERROR401.CODE,
      });
    }
    if (data && data.email) {
      const newData = { ...data.dataValues, userId: data.id };
      req.authUserDetails = newData;
      return next();
    }
  } catch (err) {
    logger.error('Error From isUserExistsOrNot() in userMiddleware', err);
    return res.status(ERROR500.CODE).json({
      error: req.t('TRY_AGAIN'),
      code: ERROR500.CODE,
    });
  }
};

// Check if email is already exists ot not
middleware.isEmailIdExistsOrNot = async (req, res, next) => {
  try {
    const data = await userService.readUserByEmailId(req.body.email);
    if (!data || !data.email) {
      return next();
    }
    if (data && data.email) {
      return res.status(ERROR409.CODE).json({
        error: req.t('ERR_EMAIL_ALREADY_EXIST'),
        code: ERROR409.CODE,
      });
    }
  } catch (err) {
    logger.error('Error From isUserExistsOrNot() in userMiddleware', err);
    return res.status(ERROR500.CODE).json({
      error: req.t('TRY_AGAIN'),
      code: ERROR500.CODE,
    });
  }
};

module.exports = middleware;
