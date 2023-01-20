const trip = require("./model");

exports.create = async (data) => {
  return trip.create(data);
};

exports.get = async (condition) => {
  return trip.findAll(condition);
};

exports.update = async (data, condition) => {
  return trip.update(data, condition);
};

exports.remove = async (condition) => {
  return trip.destroy(condition);
};
