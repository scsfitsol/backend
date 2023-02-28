const service = require("./service");
const Driver = require("../driver/model");
const Client = require("../client/model");
const Vehicle = require("../vehicle/model");
const Organization = require("../organization/model");
const Transporter = require("../transporter/model");
const Plant = require("../plant/model");
const Sequelize = require("sequelize");
const moment = require("moment");
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

    if (vehicleData?.capacity) {
      req.body.utilisation = (req.body.weight / vehicleData?.capacity) * 100;
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
      id: req.params.id,
      organizationId:
        req?.requestor?.organizationId || req?.query?.organizationId,
    });

    if (req.body.status == "2") {
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
      const driverDataForCron = await Driver.findOne({
        where: {
          id: req.body.driverId,
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
            id: req.body.driverId,
            organizationId:
              req?.requestor?.organizationId || req?.query?.organizationId,
          },
        }
      );

      const vehicleData = await Vehicle.findOne({
        where: {
          id: req.body.vehicleId,
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
          id: req.body.driverId,
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
        clientId: req.requestor.id,
        organizationId: req.requestor.organizationId,
        status: "2",
      },
    });
    const pendingTrip = await service.count({
      where: {
        clientId: req.requestor.id,
        organizationId: req.requestor.organizationId,
        status: "1",
      },
    });
    const completedTrip = await service.count({
      where: {
        clientId: req.requestor.id,
        organizationId: req.requestor.organizationId,
        status: "3",
      },
    });
    res.status(200).send({
      status: 200,
      message: "getClient Analytics  successfully",
      data,
      tripAnalyticsOfClient: {
        completedTrip: completedTrip,
        onGoingTrip: onGoingTrip,
        pendingTrip: pendingTrip,
      },
    });
  } catch (error) {
    next(error);
  }
};
