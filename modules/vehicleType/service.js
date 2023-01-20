const VehicleType = require("./model");

exports.create = async (data) => {
  return VehicleType.create(data);
};

exports.get = async (condition) => {
  return VehicleType.findAll(condition);
};

exports.update = async (data, condition) => {
  return VehicleType.update(data, condition);
};

exports.remove = async (condition) => {
  return VehicleType.destroy(condition);
};
