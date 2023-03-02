const { getDataApi, consentApi } = require("../../utils/api_calls");
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

exports.getData = async (req, res, next) => {
  try {
    const data = await getDataApi();

    res.status(200).send({
      status: "success",
      data: data?.data,
    });
  } catch (error) {
    next(error);
  }
};
exports.consentApi = async (req, res, next) => {
  try {
    const data = await consentApi(req.params.driverNumber);
    res.status(200).send({
      status: "success",
      data: data?.data,
    });
  } catch (error) {
    next(error);
  }
};
