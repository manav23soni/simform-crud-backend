const l10n = require('jm-ez-l10n');
const { check } = require('express-validator');

const productService = require('./productService');
const logger = require('../../../helper/logger');
const {
  ERROR409,
  ERROR500,
  ERROR401,
} = require('../../../constants/common');

const middleware = {};

middleware.productValidator = () => {
  return [
    check('productName', l10n.t('ERROR_PRODUCT_NAME_REQUIRED')).exists({ checkFalsy: true }),
    check('type', l10n.t('ERROR_PRODUCT_TYPE_REQUIRED')).exists({ checkFalsy: true })
  ];
};

middleware.productEditValidator = () => {
  return [
    check('productName', l10n.t('ERROR_PRODUCT_NAME_REQUIRED')).exists({ checkFalsy: true }),
    check('type', l10n.t('ERROR_PRODUCT_TYPE_REQUIRED')).exists({ checkFalsy: true }),
    check('id', l10n.t('ERROR_PRODUCT_ID_REQUIRED')).exists({ checkFalsy: true })
  ];
};

middleware.productDeleteValidator = () => {
  return [
    check('id', l10n.t('ERROR_PRODUCT_ID_REQUIRED')).exists({ checkFalsy: true })
  ];
};

middleware.checkProductUser = async (req, res, next) => {
  try {
    const { body: productDetails } = req;
    const {id} = req.authUserDetails;

    const getProduct = await productService.getProductById(productDetails.id ? productDetails.id : +req.params.productId)
    if (getProduct) {
      if (id === getProduct.userId) {
        return next();
      } else {
        return res.status(ERROR401.CODE).json({
          error: req.t('PERMISSION_ERROR'),
          code: ERROR401.CODE,
        });
      }
    } else {
      return res.status(ERROR401.CODE).json({
        error: req.t('ERROR_PRODUCT_NOT_FOUND'),
        code: ERROR400.CODE,
      });
    }
  } catch (error) {
    logger.error('Error From checkProductUser() in productMiddleware', error);
    return res.status(ERROR500.CODE).json({
      error: req.t('TRY_AGAIN'),
      code: ERROR500.CODE,
    });
  }
}

module.exports = middleware;