const Location = require("./model");

exports.create = async (data) => {
  return Location.create(data);
};

exports.get = async (condition) => {
  return Location.findAll(condition);
};

exports.update = async (data, condition) => {
  return Location.update(data, condition);
};

exports.remove = async (condition) => {
  return Location.destroy(condition);
};
