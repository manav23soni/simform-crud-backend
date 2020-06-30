const Model = require("../../../models/index");
const logger = require("../../../helper/logger");

const productService = {};

productService.addProduct = (product) => {
  return Model.products.create(product);
};

productService.editProduct = (product) => {
  return Model.products.update(product, {
    where: {
      id: product.id,
    },
  });
};

productService.getProductById = (productId) => {
  return Model.products.findOne({
    where: {
      id: productId,
    },
  });
};

productService.removeProduct = (product) => {
  return Model.products.destroy({
    where: {
      id: product.id,
    },
  });
};

productService.getAllProduct = (userId, page, limit) => {
  return Model.products.findAll({
    where: {
      userId: userId,
    },
    limit: limit,
    offset: page,
  });
};

productService.getTotalProductCount = (userId) => {
  return Model.products.count({
    where: {
      userId: userId,
    },
  });
};

module.exports = productService;
