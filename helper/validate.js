const { validationResult } = require('express-validator');
const { ERROR422 } = require('../constants/common');

const validationHandler = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(ERROR422).json({ 
      error: result.errors[0].msg,
      code: ERROR422,
    });
  }

  return next();
};

module.exports = {
  validationHandler: validationHandler,
};
