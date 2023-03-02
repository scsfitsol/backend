const yup = require("yup");
exports.vehicleValidation = async (req, res, next) => {
  try {
    const vehicleSchema = yup.object().shape({
      registrationNumber: yup
        .string()
        .required("registration number is required"),
      engineType: yup.string(),
      capacity: yup.string(),
      manufacture: yup.string(),
      allocate: yup.mixed(["true", "false"]),
      fuelType: yup.string(),
      transporterId: yup.number(),
    });
    await vehicleSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.errors[0],
    });
  }
};
exports.updateVehicleValidation = async (req, res, next) => {
  try {
    const vehicleSchema = yup.object().shape({
      registrationNumber: yup.string(),
      engineType: yup.string(),
      capacity: yup.string(),
      manufacture: yup.string(),
      allocate: yup.mixed(["true", "false"]),
      fuelType: yup.string(),
      transporterId: yup.number(),
    });
    await vehicleSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.errors[0],
    });
  }
};
