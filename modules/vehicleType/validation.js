const yup = require("yup");
exports.vehicleTypeValidation = async (req, res, next) => {
  try {
    const vehicleTypeSchema = yup.object().shape({
      name: yup.string().required("Name is required"),
      width: yup.string().required("Width is required"),
      capacity: yup.string().required("Capacity is required"),
    });
    await vehicleTypeSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      errors: error.errors[0],
    });
  }
};
exports.updateVehicleTypeValidation = async (req, res, next) => {
  try {
    const vehicleTypeSchema = yup.object().shape({
      name: yup.string(),
      width: yup.string(),
      capacity: yup.string(),
    });
    await vehicleTypeSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      errors: error.errors[0],
    });
  }
};
