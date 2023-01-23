const Driver = require("./model");

exports.create = async (data) => {
  return Driver.create(data);
};

exports.get = async (condition) => {
  return Driver.findAll(condition);
};

exports.update = async (data, condition) => {
  return Driver.update(data, condition);
};

exports.remove = async (condition) => {
  return Driver.destroy(condition);
};
