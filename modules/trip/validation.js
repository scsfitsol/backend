const yup = require("yup");
exports.tripValidation = async (req, res, next) => {
  try {
    const tripSchema = yup.object().shape({
      startDateAndTime: yup.string().required("startDateAndTime is required"),
      sourceLocation: yup.string().required("Source location is required"),
      destinationLocation: yup
        .string()
        .required("destination location is required"),
      weight: yup.string().required("Weight is required"),
      targetedDateAndTime: yup
        .string()
        .required("targetDateAndTime is required"),
      completedDateAndTime: yup.string(),
      status: yup.mixed(["1", "2", "3"]),
      carbonEmitted: yup.string(),
      driverId: yup.number().required("driver id is required field"),
      clientId: yup.number(),
      transporterId: yup.number(),
      type: yup.mixed(["simBased", "ashokleyland"]).required(),
    });
    await tripSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.errors[0],
    });
  }
};
exports.updateTripValidation = async (req, res, next) => {
  try {
    const tripSchema = yup.object().shape({
      startDateAndTime: yup.string(),
      sourceLocation: yup.string(),
      destinationLocation: yup.string(),
      weight: yup.string(),
      targetedDateAndTime: yup.string(),
      completedDateAndTime: yup.string(),
      status: yup.mixed(["1", "2", "3"]),
      carbonEmitted: yup.string(),
      utilisation: yup.number(),
      vehicleId: yup.number(),
      driverId: yup.number(),
      clientId: yup.number(),
      transporterId: yup.number(),
      type: yup.mixed(["simBased", "ashokleyland"]),
    });
    await tripSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.errors[0],
    });
  }
};
exports.updateTripStatusValidation = async (req, res, next) => {
  try {
    const tripSchema = yup.object().shape({
      vehicleId: yup.number(),
      driverId: yup.number(),
      status: yup.string().required("status is required field"),
    });
    await tripSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.errors[0],
    });
  }
};
