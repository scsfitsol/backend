const yup = require("yup");
exports.transporterValidation = async (req, res, next) => {
  try {
    const transporterSchema = yup.object().shape({
      gstNumber: yup.string().required("GST number is required"),
      transporterName: yup.string(),
    });
    await transporterSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      errors: error.errors[0],
    });
  }
};
exports.updateTransporterValidation = async (req, res, next) => {
  try {
    const transporterSchema = yup.object().shape({
      gstNumber: yup.string(),
      transporterName: yup.string(),
    });
    await transporterSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      errors: error.errors[0],
    });
  }
};
