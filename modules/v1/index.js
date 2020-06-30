const express = require('express');
const passport = require('passport');
const path = require('path');
const logger = require('../../helper/logger');
const { ERROR400 } = require('../../constants/common');

const router = express.Router();
const apiVersion = path.basename(__filename, '.js');
const app = express();

router.use((req, res, next) => {
  req.apiVersion = apiVersion;
  return next();
});

// Routes
router.use('/user', require('./user/userRoute'));
router.use('/product', require('./product/productRoute'));

router.all('/*', (req, res) => {
  logger.info('Error Log');
  return res.status(ERROR400.CODE).json({
    error: req.t(ERROR400.MESSAGE),
    code: ERROR400.CODE,
  });
});

module.exports = router;
