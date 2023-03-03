const service = require("./service");
const Driver = require("../driver/model");
const Client = require("../client/model");
const Vehicle = require("../vehicle/model");
const Organization = require("../organization/model");
const Transporter = require("../transporter/model");
const Plant = require("../plant/model");
const Sequelize = require("sequelize");
const moment = require("moment");
const { Op } = require("sequelize");
const { sqquery } = require("../../utils/query");
const { createData, deleteNumber } = require("../locationData/locationUpdate");
const {
  deleteApi,
  authApi,
  entitySearchApi,
  importApi,
} = require("../../utils/api_calls");
const sequelize = require("sequelize");
exports.create = async (req, res, next) => {
  try {
    req.body.organizationId =
      req?.requestor?.organizationId || req?.query?.organizationId;
    const [vehicleData] = await Vehicle.findAll({
      where: {
        id: req.body.vehicleId,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });

    if (vehicleData?.capacity && vehicleData?.co2PerKm) {
      req.body.utilisation = vehicleData?.co2PerKm / vehicleData?.capacity;
    }
    const data = await service.create(req.body);
    if (req.body.status == 2) {
      const vehicleData = await Vehicle.update(
        { allocate: "true" },
        {
          where: {
            id: req.body.vehicleId,
            organizationId:
              req?.requestor?.organizationId || req?.query?.organizationId,
          },
        }
      );
      const driverData = await Driver.update(
        { allocate: "true" },
        {
          where: {
            id: req.body.driverId,
            organizationId:
              req?.requestor?.organizationId || req?.query?.organizationId,
          },
        }
      );
    }
    res.status(201).json({
      status: "success",
      message: "Add trip successfully",
      data,
    });

    const driverDataForCron = await Driver.findOne({
      where: {
        id: req.body.driverId,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });
    const driverNumber = `91${driverDataForCron?.mobile}`;
    await createData(data?.id, driverNumber, data?.type, data?.vehicleId);
  } catch (error) {
    next(error);
  }
};
exports.get = async (req, res, next) => {
  try {
    const data = await service.get({
      where: {
        id: req.params.id,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
      include: [
        {
          model: Organization,
        },
        {
          model: Driver,
        },
        {
          model: Vehicle,
        },
        {
          model: Client,
          required: false,
        },
        {
          model: Transporter,
          required: false,
        },
        {
          model: Plant,
          required: false,
        },
      ],
    });

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.getAll = async (req, res, next) => {
  try {
    req.query.organizationId =
      req?.requestor?.organizationId || req?.query?.organizationId;
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate) {
      const newStartDate = new Date(startDate);
      const newEndDate = endDate ? new Date(endDate) : new Date();
      dateFilter.createdAt = {
        [sequelize.Op.gte]: newStartDate,
        [sequelize.Op.lt]: newEndDate,
      };
      req.query.createdAt = dateFilter;
    }

    delete req.query.startDate;
    delete req.query.endDate;

    const data = await service.get({
      ...sqquery(req.query),
      include: [
        {
          model: Organization,
        },
        {
          model: Driver,
        },
        {
          model: Vehicle,
        },
        {
          model: Client,
        },
        {
          model: Transporter,
          required: false,
        },
        {
          model: Plant,
          required: false,
        },
      ],
    });

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;

    const data = await service.update(req.body, {
      where: {
        id,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });

    res.status(203).send({
      status: "success",
      message: "Edit trip successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateTripStatus = async (req, res, next) => {
  try {
    let carbonEmission = 0;
    const [tripData] = await service.get({
      where: {
        id: req.params.id,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });

    if (req.body.status == "2") {
      const vehicleData = await Vehicle.update(
        { allocate: "true" },
        {
          where: {
            id: tripData?.vehicleId,
            organizationId:
              req?.requestor?.organizationId || req?.query?.organizationId,
          },
        }
      );
      const driverData = await Driver.update(
        { allocate: "true" },
        {
          where: {
            id: tripData?.driverId,
            organizationId:
              req?.requestor?.organizationId || req?.query?.organizationId,
          },
        }
      );
      const driverDataForCron = await Driver.findOne({
        where: {
          id: tripData?.driverId,
          organizationId:
            req?.requestor?.organizationId || req?.query?.organizationId,
        },
      });

      if (tripData.type == "simBased") {
        const driverNumber = `91${driverDataForCron?.mobile}`;
        await createData(req.params.id, driverNumber);
      }
    }
    if (req.body.status == "3") {
      const driverData = await Driver.update(
        { allocate: "false" },
        {
          where: {
            id: tripData?.driverId,
            organizationId:
              req?.requestor?.organizationId || req?.query?.organizationId,
          },
        }
      );

      const vehicleData = await Vehicle.findOne({
        where: {
          id: tripData?.vehicleId,
          organizationId:
            req?.requestor?.organizationId || req?.query?.organizationId,
        },
      });
      vehicleData.allocate = "false";
      await vehicleData.save();

      carbonEmission =
        vehicleData?.mileage *
          tripData?.distanceOfTrip *
          tripData?.fuelUserd *
          2.7 || 0;

      const driverDataForCron = await Driver.findOne({
        where: {
          id: tripData?.driverId,
          organizationId:
            req?.requestor?.organizationId || req?.query?.organizationId,
        },
      });

      if (tripData?.type == "simBased") {
        const driverNumber = `91${driverDataForCron?.mobile}`;
        await deleteNumber(driverNumber);
      }
    }
    const id = req.params.id;
    req.body.carbonEmission = carbonEmission;
    const data = await service.update(req.body, {
      where: {
        id,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });

    res.status(203).send({
      status: "success",
      message: "Edit trip successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.importApi = async (req, res, next) => {
  try {
    if (req.body.type == "simBased") {
      const driverDataForCron = await Driver.findOne({
        where: {
          id: req.body.driverId,
          organizationId:
            req?.requestor?.organizationId || req?.query?.organizationId,
        },
      });
      const driverNumber = `91${driverDataForCron?.mobile}`;

      const auth = await authApi();

      const importAPi = await importApi(
        driverDataForCron.name,
        "driver",
        driverNumber,
        auth?.data?.token
      );

      if (res?.status === 501) {
        es.status(501).send({
          status: "fail",
          message: "Something Went Wrong in Import APi",
        });
      }
      next();
    } else {
      next();
    }
  } catch (error) {
    res.status(501).send({
      status: "fail",
      message: "Something Went Wrong in Import APi",
    });
  }
};
exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;

    const data = await service.remove({
      where: {
        id,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });

    res.status(200).send({
      status: "success",
      message: "delete trip successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.getClientAnalytics = async (req, res, next) => {
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

    const data = await service.get({
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

    const onGoingTrip = await service.count({
      where: {
        createdAt: dateFilter.createdAt,
        clientId: req.requestor.id,
        organizationId: req.requestor.organizationId,
        status: "2",
      },
    });

    const pendingTrip = await service.count({
      where: {
        createdAt: dateFilter.createdAt,
        clientId: req.requestor.id,
        organizationId: req.requestor.organizationId,
        status: "1",
      },
    });
    const completedTrip = await service.count({
      where: {
        createdAt: dateFilter.createdAt,
        clientId: req.requestor.id,
        organizationId: req.requestor.organizationId,
        status: "3",
      },
    });
    const totalTrip = await service.count({
      where: {
        createdAt: dateFilter.createdAt,
        clientId: req.requestor.id,
        organizationId: req.requestor.organizationId,
      },
    });
    const totalOnTimeTrip = await service.count({
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

    const totalLateTrip = await service.count({
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
    const totalEarlyTrip = await service.count({
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
    const listOfTransporter = await service.get({
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
    const listOfPlant = await service.get({
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
      console.log("transporterIds-->", transporterIds[0]);
    } else {
      transporterIds = listOfTransporter.map(
        (transporter) => transporter.transporterId
      );
    }
    const filterTransporter = await service.get({
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
      data,
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
    });
  } catch (error) {
    next(error);
  }
};
