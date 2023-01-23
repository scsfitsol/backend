const Client = require("./model");

exports.create = async (data) => {
  return Client.create(data);
};

exports.get = async (condition) => {
  return Client.findAll(condition);
};

exports.update = async (data, condition) => {
  return Client.update(data, condition);
};

exports.remove = async (condition) => {
  return Client.destroy(condition);
};
