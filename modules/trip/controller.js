const service = require("./service");
const Driver = require("../driver/model");
const Client = require("../client/model");
const Vehicle = require("../vehicle/model");
const Organization = require("../organization/model");
const { sqquery, usersqquery } = require("../../utils/query");
exports.create = async (req, res, next) => {
  try {
    req.body.organizationId = req.requestor.organizationId;
    const [vehicleData] = await Vehicle.findAll({
      where: {
        id: req.body.vehicleId,
        organizationId: req.requestor.organizationId,
      },
    });

    if (vehicleData?.capacity) {
      req.body.utilisation = (req.body.weight / vehicleData?.capacity) * 100;
    }

    const data = await service.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Add trip successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.get = async (req, res, next) => {
  try {
    const data = await service.get({
      where: {
        id: req.params.id,
        organizationId: req.requestor.organizationId,
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
    const data = await service.get({
      organizationId: req.requestor.organizationId,
      ...sqquery(req.query),
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
        organizationId: req.requestor.organizationId,
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
    if (req.body.status == "2") {
      const vehicleData = await Vehicle.update(
        { allocate: "true" },
        {
          where: {
            id: req.body.vehicleId,
            organizationId: req.requestor.organizationId,
          },
        }
      );
      const driverData = await Driver.update(
        { allocate: "true" },
        {
          where: {
            id: req.body.driverId,
            organizationId: req.requestor.organizationId,
          },
        }
      );
    }
    if (req.body.status == "3") {
      const driverData = await Driver.update(
        { allocate: "false" },
        {
          where: {
            id: req.body.driverId,
            organizationId: req.requestor.organizationId,
          },
        }
      );

      const [vehicleData] = await Vehicle.findAll({
        where: {
          id: req.body.vehicleId,
          organizationId: req.requestor.organizationId,
        },
      });
      vehicleData.allocate = "false";
      await vehicleData.save();

      const [tripData] = await service.get({
        id: req.params.id,
        organizationId: req.requestor.organizationId,
      });
      carbonEmission =
        vehicleData?.mileage *
          tripData?.distanceOfTrip *
          tripData?.fuelUserd *
          2.7 || 0;
    }
    const id = req.params.id;
    req.body.carbonEmission = carbonEmission;
    const data = await service.update(req.body, {
      where: {
        id,
        organizationId: req.requestor.organizationId,
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
exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;

    const data = await service.remove({
      where: {
        id,
        organizationId: req.requestor.organizationId,
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
