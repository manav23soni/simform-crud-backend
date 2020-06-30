const fs = require('fs');

const {
  _,
} = global;

const utils = {};

utils.isDefined = (variable) => {
  if (typeof variable === 'boolean') return true;
  return (variable !== undefined && typeof variable !== 'undefined' && variable !== null && variable !== '');
};

utils.empty = (mixedVar) => {
  let i;
  let len;
  const emptyValues = ['undefined', 'null', null, false, 0, '', '0', undefined];
  for (i = 0, len = emptyValues.length; i < len; i += 1) {
    if (mixedVar === emptyValues[i]) {
      return true;
    }
  }
  if (typeof mixedVar === 'object') {
    const keys = _.keys(mixedVar);
    return keys.length === 0;
  }
  return false;
};

module.exports = utils;
