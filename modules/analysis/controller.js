const Vehicle = require("../vehicle/model");
const Driver = require("../driver/model");
const Client = require("../client/model");
const plant = require("../plant/model");
const Trip = require("../trip/model");
const vehicle = require("../vehicle/model");
const Transporter = require("../transporter/model");
const sequelize = require("../../config/db");
const Sequelize = require("sequelize");
const Plant = require("../plant/model");
const { Op } = require("sequelize");

exports.getAll = async (req, res, next) => {
  try {
    const driver = await Driver.findAndCountAll({
      where: {
        organizationId: req.requestor.organizationId,
      },
    });
    const client = await Client.findAndCountAll({
      where: {
        organizationId: req.requestor.organizationId,
      },
    });
    const plant = await Plant.findAndCountAll({
      where: {
        organizationId: req.requestor.organizationId,
      },
    });
    const vehicle = await Vehicle.findAndCountAll({
      where: {
        organizationId: req.requestor.organizationId,
      },
    });

    const allocatedVehicle = await Vehicle.findAndCountAll({
      where: {
        organizationId: req.requestor.organizationId,
        allocate: true,
      },
    });

    const freeVehicle = await Vehicle.findAndCountAll({
      where: {
        organizationId: req.requestor.organizationId,
        allocate: false,
      },
    });

    const transporter = await Transporter.findAndCountAll({
      where: {
        organizationId: req.requestor.organizationId,
      },
    });

    const totalTrip = await Trip.findAndCountAll({
      where: {
        organizationId: req.requestor.organizationId,
      },
    });

    const totalLateTrip = await Trip.findAndCountAll({
      where: {
        organizationId: req.requestor.organizationId,
        targetedTime: {
          [Op.lt]: Sequelize.col("completedTime"),
        },
      },
    });

    const totalEarlyTrip = await Trip.findAndCountAll({
      where: {
        organizationId: req.requestor.organizationId,
        targetedTime: {
          [Op.gt]: Sequelize.col("completedTime"),
        },
      },
    });

    res.status(200).send({
      status: "success",
      data: {
        driver: driver.count,
        client: client.count,
        plant: plant.count,
        vehicle: {
          vehicle: vehicle.count,
          allocatedVehicle: allocatedVehicle.count,
          freeVehicle: freeVehicle.count,
        },
        transporter: transporter.count,
        trip: {
          total: totalTrip.count,
          totalLateTrip: totalLateTrip.count,
          totalEarlyTrip: totalEarlyTrip.count,
        },
      },
    });
  } catch (error) {
    next(error || createError(404, "Data not found"));
  }
};
