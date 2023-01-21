const Transporter = require("./model");

exports.create = async (data) => {
  return Transporter.create(data);
};

exports.get = async (condition) => {
  return Transporter.findAll(condition);
};

exports.update = async (data, condition) => {
  return Transporter.update(data, condition);
};

exports.remove = async (condition) => {
  return Transporter.destroy(condition);
};
