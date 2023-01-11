const Driver = require("./model");

exports.create = async (data) => {
  return Driver.create(data);
};

exports.get = async (condition) => {
  return Driver.findAll(condition);
};

exports.update = async (id, data) => {
  return Driver.update(data, { where: { id } });
};

exports.remove = async (condition) => {
  return Driver.destroy(condition);
};
