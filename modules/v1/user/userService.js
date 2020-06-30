const Model = require('../../../models/index');
const logger = require('../../../helper/logger');

const userService = {};

userService.addUser = async (data) => {
  try {
    const result = await Model.users.create(data);
    return result;
  } catch (error) {
    logger.error('[ERROR] From addUser in userService', error);
    return error;
  }
};


userService.readUserByEmailId = async (email) => {
  try {
    const userData = await Model.users.findOne({
      where: {
        email: email,
      },
    });
    return userData || null;
  } catch (error) {
    logger.error('[ERROR] From readUserByEmailId in userService', error);
    return error;
  }
};  

module.exports = userService;
