const yup = require("yup");

exports.clientValidation = async (req, res, next) => {
  try {
    const phoneRegExp =
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const clientSchema = yup.object().shape({
      name: yup.string().required("Name is required"),
      password: yup.string().required("Password is required"),
      email: yup
        .string()
        .email("Please enter valid email")
        .required("Email is required"),
      mobile: yup
        .string()
        .matches(phoneRegExp, " mobile no should be valid 10 digits")
        .min(10, " mobile no should be valid 10 digits")
        .max(10, " mobile no should be valid 10 digits"),
      insuranceNumber: yup.string(),
    });

    await clientSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.errors[0],
    });
  }
};
exports.updateClientValidation = async (req, res, next) => {
  try {
    const clientSchema = yup.object().shape({
      name: yup.string(),
      password: yup.string(),
      email: yup.string().email("Please enter valid email"),
    });
    await clientSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.errors[0],
    });
  }
};
exports.loginValidation = async (req, res, next) => {
  try {
    const LoginSchema = yup.object().shape({
      name: yup.string(),
      email: yup
        .string()
        .email("Please enter valid email")
        .required("Email is required"),
      password: yup.string().required("Password is required"),
    });
    await LoginSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.errors[0],
    });
  }
};
exports.forgotPasswordValidation = async (req, res, next) => {
  try {
    const LoginSchema = yup.object().shape({
      email: yup
        .string()
        .email("Please enter valid email")
        .required("Email is required"),
    });
    await LoginSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.errors[0],
    });
  }
};
