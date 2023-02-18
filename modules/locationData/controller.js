const service = require("./service");

exports.get = async (req, res, next) => {
  try {
    const data = await service.get({
      where: {
        tripId: req.params.id,
      },
    });

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
