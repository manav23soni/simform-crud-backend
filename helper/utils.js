const fs = require('fs');

const {
  _,
} = global;

const utils = {};

utils.isDefined = (variable) => {
  if (typeof variable === 'boolean') return true;
  return (variable !== undefined && typeof variable !== 'undefined' && variable !== null && variable !== '');
};

utils.isEmpty = (obj) => {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

module.exports = utils;
