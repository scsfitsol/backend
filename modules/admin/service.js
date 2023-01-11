const Admin = require("./model");

exports.create = async (data) => {
  return Admin.create(data);
};

exports.get = async (conditions) => {
  return Admin.findAll(conditions);
};

exports.update = async (id, data) => {
  return Admin.update(data, { where: { id } });
};

exports.remove = async (condition) => {
  return Admin.destroy(condition);
};
