const yup = require("yup");
exports.plantValidation = async (req, res, next) => {
  try {
    const transporterSchema = yup.object().shape({
      unitName: yup.string(),
      GST: yup.string(),
      clientId: yup.number().required("client id is required field"),
      location: yup.string(),
    });
    await transporterSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.errors[0],
    });
  }
};
exports.updatePlantValidation = async (req, res, next) => {
  try {
    const transporterSchema = yup.object().shape({
      unitName: yup.string(),
      GST: yup.string(),
      location: yup.string(),
      clientId: yup.number(),
    });
    await transporterSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.errors[0],
    });
  }
};
