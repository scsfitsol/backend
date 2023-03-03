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
    let transporterIds;

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

    const data = await Trip.findAll({
      where: {
        clientId: req.requestor.id,
        organizationId: req.requestor.organizationId,
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

    const onGoingTrip = await Trip.count({
      where: {
        createdAt: dateFilter.createdAt,
        clientId: req.requestor.id,
        organizationId: req.requestor.organizationId,
        status: "2",
      },
    });

    const pendingTrip = await Trip.count({
      where: {
        createdAt: dateFilter.createdAt,
        clientId: req.requestor.id,
        organizationId: req.requestor.organizationId,
        status: "1",
      },
    });
    const completedTrip = await Trip.count({
      where: {
        createdAt: dateFilter.createdAt,
        clientId: req.requestor.id,
        organizationId: req.requestor.organizationId,
        status: "3",
      },
    });
    const totalTrip = await Trip.count({
      where: {
        createdAt: dateFilter.createdAt,
        clientId: req.requestor.id,
        organizationId: req.requestor.organizationId,
      },
    });
    const totalOnTimeTrip = await Trip.count({
      where: {
        createdAt: dateFilter.createdAt,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        clientId: req.requestor.id,
        targetedDateAndTime: {
          [Op.eq]: Sequelize.col("completedDateAndTime"),
        },
      },
    });

    const totalLateTrip = await Trip.count({
      where: {
        createdAt: dateFilter.createdAt,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        clientId: req.requestor.id,
        targetedDateAndTime: {
          [Op.lt]: Sequelize.col("completedDateAndTime"),
        },
      },
    });
    const totalEarlyTrip = await Trip.count({
      where: {
        createdAt: dateFilter.createdAt,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        clientId: req.requestor.id,
        targetedDateAndTime: {
          [Op.gt]: Sequelize.col("completedDateAndTime"),
        },
      },
    });
    const totalPlant = await Plant.count({
      where: {
        createdAt: dateFilter.createdAt,
        clientId: req.requestor.id,
        organizationId: req.requestor.organizationId,
      },
    });
    const listOfTransporter = await Trip.findAll({
      where: {
        createdAt: dateFilter.createdAt,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        clientId: req.requestor.id,
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
      attributes: ["transporterId"],
    });
    const listOfPlant = await Trip.findAll({
      where: {
        createdAt: dateFilter.createdAt,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        clientId: req.requestor.id,
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
      attributes: ["plantId"],
    });
    if (req.query.transporterId) {
      transporterIds = JSON.parse(req.query.transporterId);
    } else {
      transporterIds = listOfTransporter.map(
        (transporter) => transporter.transporterId
      );
    }
    const filterTransporter = await Trip.findAll({
      where: {
        createdAt: dateFilter.createdAt,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
        status: 3,
        clientId: req.requestor.id,
        transporterId: {
          [Op.or]: transporterIds,
        },
      },
      include: [
        {
          model: Transporter,
          required: false,
          attributes: [
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
      attributes: ["clientId"],
    });
    res.status(200).send({
      status: 200,
      message: "getClient Analytics  successfully",
      data: {
        clientAnalyticsMonthWise: data,
        tripAnalyticsOfClient: {
          totalTrip: totalTrip,
          completedTrip: completedTrip,
          onGoingTrip: onGoingTrip,
          pendingTrip: pendingTrip,
          totalEarlyTrip,
          totalOnTimeTrip,
          totalLateTrip,
        },
        plantAnalytics: {
          totalPlant: totalPlant,
          listOfPlant,
        },
        transporterAnalytics: {
          listOfTransporter,
          filterTransporter,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
