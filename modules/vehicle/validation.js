const yup = require("yup");
exports.vehicleValidation = async (req, res, next) => {
  try {
    const vehicleSchema = yup.object().shape({
      registrationNumber: yup
        .string()
        .required("registration number is required"),
      make: yup.string().required("make(o) is required field"),
      tonnage: yup.string().required("tonnage(o)  is required field"),
      vehicleTypeId: yup.number().required("vehicle type id is required field"),
    });
    await vehicleSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      errors: error.errors[0],
    });
  }
};
exports.updateVehicleValidation = async (req, res, next) => {
  try {
    const vehicleSchema = yup.object().shape({
      registrationNumber: yup.string(),
      make: yup.string(),
      tonnage: yup.string(),
      vehicleTypeId: yup.number(),
    });
    await vehicleSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      errors: error.errors[0],
    });
  }
};
