const yup = require("yup");
exports.tripValidation = async (req, res, next) => {
  try {
    const tripSchema = yup.object().shape({
      startLocation: yup.string().required("start location is required"),
      endLocation: yup.string().required("end location is required"),
      startTime: yup.string().required("start Time is required"),
      targetTime: yup.string().required("target time is required"),
      completedTime: yup.string().required("completed time is required"),
      status: yup.mixed(["pending", "ongoing", "completed"]),
      vehicleId: yup.number().required("vehicle id is required field"),
      driverId: yup.number().required("driver id is required field"),
    });
    await tripSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      errors: error.errors[0],
    });
  }
};
exports.updateTripValidation = async (req, res, next) => {
  try {
    const tripSchema = yup.object().shape({
      startLocation: yup.string(),
      endLocation: yup.string(),
      startTime: yup.string(),
      targetTime: yup.string(),
      completedTime: yup.string(),
      status: yup.mixed(["pending", "ongoing", "completed"]),
      vehicleId: yup.number(),
      driverId: yup.number(),
    });
    await tripSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      errors: error.errors[0],
    });
  }
};
