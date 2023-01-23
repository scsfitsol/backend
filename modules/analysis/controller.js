const Vehicle = require("../vehicle/model");
const Driver = require("../driver/model");
const Client = require("../client/model");
const Plant = require("../plant/model");
const Trip = require("../trip/model");
const Transporter = require("../transporter/model");
const sequelize = require("../../config/db");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

exports.getAll = async (req, res, next) => {
  try {
    const driver = await Driver.count({
      where: {
        organizationId: req.requestor.organizationId,
      },
    });
    const client = await Client.count({
      where: {
        organizationId: req.requestor.organizationId,
      },
    });
    const plant = await Plant.count({
      where: {
        organizationId: req.requestor.organizationId,
      },
    });
    const vehicle = await Vehicle.count({
      where: {
        organizationId: req.requestor.organizationId,
      },
    });
    const allocatedVehicle = await Vehicle.count({
      where: {
        organizationId: req.requestor.organizationId,
        allocate: true,
      },
    });
    const freeVehicle = await Vehicle.count({
      where: {
        organizationId: req.requestor.organizationId,
        allocate: false,
      },
    });

    const totalTrip = await Trip.count({
      where: {
        organizationId: req.requestor.organizationId,
      },
    });
    const totalOnTimeTrip = await Trip.count({
      where: {
        organizationId: req.requestor.organizationId,
        targetedDateAndTime: {
          [Op.eq]: Sequelize.col("completedDateAndTime"),
        },
      },
    });

    const totalLateTrip = await Trip.count({
      where: {
        organizationId: req.requestor.organizationId,
        targetedDateAndTime: {
          [Op.lt]: Sequelize.col("completedDateAndTime"),
        },
      },
    });
    const totalEarlyTrip = await Trip.count({
      where: {
        organizationId: req.requestor.organizationId,
        targetedDateAndTime: {
          [Op.gt]: Sequelize.col("completedDateAndTime"),
        },
      },
    });
    const transporter = await Transporter.count({
      where: {
        organizationId: req.requestor.organizationId,
      },
    });
    const listOfTransporter = await Trip.findAll({
      where: {
        organizationId: req.requestor.organizationId,
      },
      group: ["transporterId"],
      include: [
        {
          model: Transporter,
          required: false,
          attributes: [
            "id",
            "transporterName",
            [Sequelize.fn("count", Sequelize.col("transporterId")), "count"],
          ],
        },
      ],
    });
    const getTransporterTripDetail = (data) =>
      new Promise(async (resolve, reject) => {
        try {
          console.log("data2------>", data);
          console.log("count2------>", data.count);
          const EarlyTransporterTrip = await Trip.count({
            where: {
              organizationId: req.requestor.organizationId,
              transporterId: data.id,
              targetedDateAndTime: {
                [Op.lt]: Sequelize.col("completedDateAndTime"),
              },
            },
          });
          const LateTransporterTrip = await Trip.count({
            where: {
              organizationId: req.requestor.organizationId,
              transporterId: data.id,
              targetedDateAndTime: {
                [Op.gt]: Sequelize.col("completedDateAndTime"),
              },
            },
          });
          const EqualTransporterTrip = await Trip.count({
            where: {
              organizationId: req.requestor.organizationId,
              transporterId: data.id,
              targetedDateAndTime: {
                [Op.eq]: Sequelize.col("completedDateAndTime"),
              },
            },
          });
          return resolve({
            id: data.id,
            name: data.transporterName,
            count: data.count,
            EarlyTransporterTrip,
            LateTransporterTrip,
            EqualTransporterTrip,
          });
        } catch (error) {
          console.log("Error in getTransporterTripDetail", error);
          reject(error);
        }
      });
    const transporterAnalytics = await Promise.all(
      listOfTransporter.map((data) =>
        getTransporterTripDetail(data.transporter.dataValues)
      )
    );

    res.status(200).send({
      status: "success",
      data: {
        driver: driver,
        client: client,
        plant: plant,
        vehicle: {
          vehicle,
          allocatedVehicle,
          freeVehicle,
        },
        transporter: {
          transporter,
          transporterAnalytics,
        },
        trip: {
          totalTrip,
          totalLateTrip,
          totalEarlyTrip,
          totalOnTimeTrip,
        },
      },
    });
  } catch (error) {
    next(error || createError(404, "Data not found"));
  }
};
