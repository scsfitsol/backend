const Vehicle = require("../vehicle/model");
const Driver = require("../driver/model");
const Client = require("../client/model");
const Plant = require("../plant/model");
const Trip = require("../trip/model");
const Transporter = require("../transporter/model");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const moment = require("moment");
const sequelize = require("sequelize");

exports.getAll = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate) {
      const newStartDate = new Date(startDate);
      const newEndDate = endDate ? new Date(endDate) : new Date();
      dateFilter.createdAt = {
        [sequelize.Op.gte]: newStartDate,
        [sequelize.Op.lt]: moment(newEndDate).add(1, "days"),
      };
    } else {
      const currentYear = moment(new Date()).format("YYYY");

      dateFilter.createdAt = {
        [sequelize.Op.gte]: `${currentYear}-01-01`,
        [sequelize.Op.lte]: moment(`${currentYear}-12-31`).add(1, "days"),
      };
    }
    let startingDate = moment().subtract(30, "days");
    let dataFilter = {
      createdAt: {
        [Op.gte]: new Date(startingDate),
        [Op.lte]: moment(new Date()).add(1, "days"),
      },
      organizationId:
        req?.requestor?.organizationId || req?.query?.organizationId,
    };
    let dataFilterTripCompleted = {
      createdAt: {
        [Op.gte]: new Date(startingDate),
        [Op.lte]: moment(new Date()).add(1, "days"),
      },
      organizationId:
        req?.requestor?.organizationId || req?.query?.organizationId,
      status: 3,
    };

    const driver = await Driver.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        createdAt: dateFilter.createdAt,
      },
    });

    const last30DaysDriver = await Driver.count({
      where: dataFilter,
    });

    const client = await Client.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        createdAt: dateFilter.createdAt,
      },
    });
    const last30DaysClient = await Client.count({
      where: dataFilter,
    });
    const plant = await Plant.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        createdAt: dateFilter.createdAt,
      },
    });
    const last30DaysPlant = await Plant.count({
      where: dataFilter,
    });
    const vehicle = await Vehicle.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        createdAt: dateFilter.createdAt,
      },
    });
    const last30DaysVehicle = await Vehicle.count({
      where: dataFilter,
    });
    const allocatedVehicle = await Vehicle.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        allocate: "true",
        createdAt: dateFilter.createdAt,
      },
    });
    const freeVehicle = await Vehicle.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        allocate: "false",
        createdAt: dateFilter.createdAt,
      },
    });

    const totalTrip = await Trip.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        createdAt: dateFilter.createdAt,
      },
    });

    const last30DaysTrip = await Trip.count({
      where: dataFilterTripCompleted,
    });
    const totalOnTimeTrip = await Trip.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        targetedDateAndTime: {
          [Op.eq]: Sequelize.col("completedDateAndTime"),
        },
        createdAt: dateFilter.createdAt,
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
        createdAt: dateFilter.createdAt,
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
        createdAt: dateFilter.createdAt,
      },
    });
    const tripAnalytics = await Trip.findAll({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        createdAt: dateFilter.createdAt,
      },
      attributes: [
        [
          Sequelize.fn("sum", Sequelize.col("carbonEmission")),
          "carbonEmissionSum",
        ],
        [Sequelize.fn("avg", Sequelize.col("utilisation")), "utilisationAvg"],
      ],
    });
    const last30DaysTripAnalytics = await Trip.findAll({
      where: dataFilterTripCompleted,
      attributes: [
        [
          Sequelize.fn("sum", Sequelize.col("carbonEmission")),
          "carbonEmissionSum",
        ],
        [Sequelize.fn("avg", Sequelize.col("utilisation")), "utilisationAvg"],
      ],
    });
    const lastAllMonthsTripAnalytics = await Trip.findAll({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        $and: Sequelize.where(
          sequelize.fn("year", sequelize.col("createdAt")),
          moment(new Date()).format("YYYY")
        ),
      },
      group: [sequelize.fn("month", sequelize.col("createdAt"))],
      attributes: [
        [
          sequelize.fn("sum", Sequelize.col("carbonEmission")),
          "carbonEmissionSum",
        ],
        [sequelize.fn("avg", Sequelize.col("utilisation")), "utilisationAvg"],
        [sequelize.fn("month", sequelize.col("createdAt")), "month"],
        [sequelize.fn("count", Sequelize.col("id")), "count"],
      ],
    });
    const clientAnalytics = await Trip.findAll({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        createdAt: dateFilter.createdAt,
      },
      group: "clientId",
      include: [
        {
          model: Client,
          required: false,
          attributes: [
            "id",
            "name",
            [Sequelize.fn("count", Sequelize.col("clientId")), "count"],
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
      attributes: ["clientId"],
    });
    const last30DaysTripUtilisation = await Trip.findAll({
      where: dataFilterTripCompleted,
      group: [sequelize.fn("date", sequelize.col("createdAt"))],
      attributes: [
        [sequelize.fn("avg", Sequelize.col("utilisation")), "utilisationAvg"],
        [sequelize.fn("date", sequelize.col("createdAt")), "date"],
      ],
    });

    const transporter = await Transporter.count({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        createdAt: dateFilter.createdAt,
      },
    });
    const last30DaysTransporter = await Transporter.count({
      where: dataFilter,
    });
    const listOfTransporter = await Trip.findAll({
      where: {
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        createdAt: dateFilter.createdAt,
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
        status: 3,
        createdAt: dateFilter.createdAt,
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
              createdAt: dateFilter.createdAt,
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
              createdAt: dateFilter.createdAt,
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
              createdAt: dateFilter.createdAt,
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
                createdAt: dateFilter.createdAt,
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
                createdAt: dateFilter.createdAt,
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
                createdAt: dateFilter.createdAt,
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
          last30DaysTripAnalytics,
          last30DaysTripUtilisation,
          lastAllMonthsTripAnalytics,
          clientAnalytics,
        },
      },
    });
  } catch (error) {
    next(error || createError(404, "Data not found"));
  }
};
