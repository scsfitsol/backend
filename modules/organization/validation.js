const yup = require("yup");
exports.organizationValidation = async (req, res, next) => {
  try {
    const organizationSchema = yup.object().shape({
      name: yup.string().required("Name is required"),
      email: yup
        .string()
        .email("Please enter valid email")
        .required("Email is required"),
      password: yup.string().required("Password is required"),
    });
    await organizationSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      errors: error.errors[0],
    });
  }
};
exports.updateOrganizationValidation = async (req, res, next) => {
  try {
    const organizationSchema = yup.object().shape({
      name: yup.string(),
      email: yup
        .string()
        .email("Please enter valid email")
        .required("Email is required"),
      password: yup.string(),
    });
    await organizationSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      errors: error.errors[0],
    });
  }
};
