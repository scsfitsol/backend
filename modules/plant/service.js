const Plant = require("./model");

exports.create = async (data) => {
  return Plant.create(data);
};

exports.get = async (condition) => {
  return Plant.findAll(condition);
};

exports.update = async (data, condition) => {
  return Plant.update(data, condition);
};

exports.remove = async (condition) => {
  return Plant.destroy(condition);
};
