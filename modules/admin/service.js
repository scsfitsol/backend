const Admin = require("./model");

exports.create = async (data) => {
  return Admin.create(data);
};

exports.get = async (conditions) => {
  return Admin.findAll(conditions);
};

exports.update = async (data, condition) => {
  return Admin.update(data, condition);
};

exports.remove = async (condition) => {
  return Admin.destroy(condition);
};
