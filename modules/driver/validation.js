const yup = require("yup");
exports.driverValidation = async (req, res, next) => {
  try {
    const phoneRegExp =
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const driverSchema = yup.object().shape({
      name: yup.string().required("Name is required"),
      // drivingLicense: yup.string().required("Driver License is required field"),
      allocate: yup.mixed(["true", "false"]),
      mobile: yup
        .string()
        .matches(phoneRegExp, " mobile no should be valid 10 digits")
        .min(10, " mobile no should be valid 10 digits")
        .max(10, " mobile no should be valid 10 digits"),
    });
    await driverSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.errors[0],
    });
  }
};
exports.updateDriverValidation = async (req, res, next) => {
  try {
    const phoneRegExp =
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const driverSchema = yup.object().shape({
      name: yup.string(),
      drivingLicense: yup.string(),
      allocate: yup.mixed(["true", "false"]),
      mobile: yup
        .string()
        .matches(phoneRegExp, " mobile no should be valid 10 digits")
        .min(10, " mobile no should be valid 10 digits")
        .max(10, " mobile no should be valid 10 digits"),
    });
    await driverSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.errors[0],
    });
  }
};
