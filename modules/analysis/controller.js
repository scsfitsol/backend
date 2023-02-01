const Vehicle = require("../vehicle/model");
const Driver = require("../driver/model");
const Client = require("../client/model");
const Plant = require("../plant/model");
const Trip = require("../trip/model");
const Transporter = require("../transporter/model");
const sequelize = require("../../config/db");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const moment = require("moment");

exports.getAll = async (req, res, next) => {
  try {
    let startDate = moment().subtract(30, "days");
    let dataFilter = {
      createdAt: {
        [Op.gte]: new Date(startDate),
        [Op.lte]: moment(new Date()).add(1, "days"),
      },
    };

    const driver = await Driver.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });

    const last30DaysDriver = await Driver.count({
      where: dataFilter,
    });

    const client = await Client.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });
    const last30DaysClient = await Client.count({
      where: dataFilter,
    });
    const plant = await Plant.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });
    const last30DaysPlant = await Plant.count({
      where: dataFilter,
    });
    const vehicle = await Vehicle.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });
    const last30DaysVehicle = await Vehicle.count({
      where: dataFilter,
    });
    const allocatedVehicle = await Vehicle.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        allocate: true,
      },
    });
    const freeVehicle = await Vehicle.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        allocate: false,
      },
    });

    const totalTrip = await Trip.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
      },
    });
    const last30DaysTrip = await Trip.count({
      where: dataFilter,
      status: 3,
    });
    const totalOnTimeTrip = await Trip.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        targetedDateAndTime: {
          [Op.eq]: Sequelize.col("completedDateAndTime"),
        },
      },
    });

    const totalLateTrip = await Trip.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        targetedDateAndTime: {
          [Op.lt]: Sequelize.col("completedDateAndTime"),
        },
      },
    });
    const totalEarlyTrip = await Trip.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        targetedDateAndTime: {
          [Op.gt]: Sequelize.col("completedDateAndTime"),
        },
      },
    });
    const tripAnalytics = await Trip.findAll({
      where: {
        status: 3,
      },
      attributes: [
        [
          Sequelize.fn("sum", Sequelize.col("carbonEmission")),
          "carbonEmissionSum",
        ],
        [Sequelize.fn("avg", Sequelize.col("utilisation")), "utilisationAvg"],
      ],
    });

    const transporter = await Transporter.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });
    const last30DaysTransporter = await Transporter.count({
      where: dataFilter,
    });
    const listOfTransporter = await Trip.findAll({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
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
            [
              Sequelize.fn("sum", Sequelize.col("carbonEmission")),
              "carbonEmissionSum",
            ],
            [
              Sequelize.fn("avg", Sequelize.col("utilisation")),
              "utilisationAvg",
            ],
          ],
        },
      ],
    });
    const listOfPlant = await Trip.findAll({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
      group: ["plantId"],
      include: [
        {
          model: Plant,
          required: false,
          attributes: [
            "id",
            "unitName",
            [Sequelize.fn("count", Sequelize.col("plantId")), "count"],
            [
              Sequelize.fn("sum", Sequelize.col("carbonEmission")),
              "carbonEmissionSum",
            ],
            [
              Sequelize.fn("avg", Sequelize.col("utilisation")),
              "utilisationAvg",
            ],
          ],
        },
      ],
    });
    const getTransporterTripDetail = (data) =>
      new Promise(async (resolve, reject) => {
        try {
          const EarlyTransporterTrip = await Trip.count({
            where: {
              organizationId:
                req?.requestor?.organizationId || req?.query?.organizationId,
              transporterId: data.id,
              status: 3,
              targetedDateAndTime: {
                [Op.lt]: Sequelize.col("completedDateAndTime"),
              },
            },
          });
          const LateTransporterTrip = await Trip.count({
            where: {
              organizationId:
                req?.requestor?.organizationId || req?.query?.organizationId,
              transporterId: data.id,
              status: 3,
              targetedDateAndTime: {
                [Op.gt]: Sequelize.col("completedDateAndTime"),
              },
            },
          });
          const EqualTransporterTrip = await Trip.count({
            where: {
              organizationId:
                req?.requestor?.organizationId || req?.query?.organizationId,
              transporterId: data.id,
              status: 3,
              targetedDateAndTime: {
                [Op.eq]: Sequelize.col("completedDateAndTime"),
              },
            },
          });
          return resolve({
            id: data.id,
            name: data.transporterName,
            count: data.count,
            carbonEmissionSum: data.carbonEmissionSum,
            utilisationAvg: data.utilisationAvg,

            EarlyTransporterTrip,
            LateTransporterTrip,
            EqualTransporterTrip,
          });
        } catch (error) {
          console.log("Error in getTransporterTripDetail", error);
          reject(error);
        }
      });
    const getPlantTripDetail = async (data) =>
      new Promise(async (resolve, reject) => {
        try {
          if (data.id) {
            const EarlyPlantTrip = await Trip.count({
              where: {
                organizationId:
                  req?.requestor?.organizationId || req?.query?.organizationId,
                plantId: data?.id,
                status: 3,
                targetedDateAndTime: {
                  [Op.lt]: Sequelize.col("completedDateAndTime"),
                },
              },
            });
            const LatePlantTrip = await Trip.count({
              where: {
                organizationId:
                  req?.requestor?.organizationId || req?.query?.organizationId,
                plantId: data?.id,
                status: 3,
                targetedDateAndTime: {
                  [Op.gt]: Sequelize.col("completedDateAndTime"),
                },
              },
            });
            const EqualPlantTrip = await Trip.count({
              where: {
                organizationId:
                  req?.requestor?.organizationId || req?.query?.organizationId,
                plantId: data?.id,
                status: 3,
                targetedDateAndTime: {
                  [Op.eq]: Sequelize.col("completedDateAndTime"),
                },
              },
            });
            return resolve({
              id: data?.id,
              name: data?.unitName,
              count: data?.count,
              carbonEmissionSum: data?.carbonEmissionSum,
              utilisationAvg: data?.utilisationAvg,
              EarlyPlantTrip,
              LatePlantTrip,
              EqualPlantTrip,
            });
          }
        } catch (error) {
          console.log("Error in getPlantTripDetail", error);
          reject(error);
        }
      });
    const transporterAnalytics = await Promise.all(
      listOfTransporter
        .filter((singleData) => singleData?.transporter?.dataValues)
        .map((data) => getTransporterTripDetail(data.transporter.dataValues))
    );
    const plantAnalytics = await Promise.all(
      listOfPlant
        .filter((singleData) => singleData?.plant?.dataValues)
        .map((data) => getPlantTripDetail(data?.plant?.dataValues))
    );

    res.status(200).send({
      status: "success",
      data: {
        last30DaysDriver,

        driver: driver,
        client: client,
        last30DaysClient,
        vehicle: {
          vehicle,
          last30DaysVehicle,
          allocatedVehicle,
          freeVehicle,
        },
        plant: {
          plant,
          last30DaysPlant,
          plantAnalytics,
        },
        transporter: {
          transporter,
          last30DaysTransporter,
          transporterAnalytics,
        },
        trip: {
          totalTrip,
          last30DaysTrip,
          totalLateTrip,
          totalEarlyTrip,
          totalOnTimeTrip,
          tripAnalytics,
        },
      },
    });
  } catch (error) {
    next(error || createError(404, "Data not found"));
  }
};
