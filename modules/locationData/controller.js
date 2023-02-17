const service = require("./service");
const { sqquery } = require("../../utils/query");
const Driver = require("../driver/model");
const Vehicle = require("../vehicle/model");
const Client = require("../client/model");
const Trip = require("../trip/model");

exports.get = async (req, res, next) => {
  try {
    const data = await service.get({
      where: {
        tripId: req.params.id,
      },
      include: [
        {
          model: Trip,
          include: [
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
