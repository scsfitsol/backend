const service = require("./service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var createError = require("http-errors");
const Organization = require("../organization/model");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [admin] = await service.get({
      where: {
        email,
      },
    });
    if (admin) {
      const correctPassword = await bcrypt.compare(password, admin.password);
      if (correctPassword) {
        const token = jwt.sign(
          {
            id: admin.id,
            role: admin.role,
            organizationId: admin?.organizationId,
          },
          process.env.JWT_SECRETE,
          {
            expiresIn: process.env.JWT_EXPIREIN,
          }
        );
        res.status(200).json({
          status: "success",
          message: "Admin login successfully",
          token,
        });
      } else {
        next(
          createError(401, "Admin login fail bcz id and password doesn't match")
        );
      }
    } else {
      next(
        new Error("Admin login fail bcz id and password doesn't match", 401)
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const [adminWithSameEmail] = await service.get({
      where: {
        email: req.body.email,
      },
    });

    // user with email is  found.
    if (adminWithSameEmail) {
      return res.status(400).json({
        message: "This email is already register,try with another one",
      });
    }
    if (req.files) {
      if (req?.files["panCard"]) {
        req.body.panCard = req.files["panCard"][0]["location"];
      }
      if (req?.files["aadharCard"]) {
        req.body.aadharCard = req.files["aadharCard"][0]["location"];
      }
      if (req?.files["anyOtherCompanySpecificId"]) {
        req.body.anyOtherCompanySpecificId =
          req?.files["anyOtherCompanySpecificId"][0]["location"] || null;
      }
      if (req?.files["profilePic"]) {
        req.body.profilePic = req.files["profilePic"][0]["location"];
      }
    }
    const data = await service.create(req.body);

    res.status(200).send({
      status: 200,
      message: "Admin signup Successfully",
      data,
    });
  } catch (error) {
    next(error || createError(404, "Data not found"));
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const data = await service.get({
      where: {
        id: req.requestor.id,
      },
      include: [
        {
          model: Organization,
          required: false,
        },
      ],
    });

    res.status(200).send({
      status: 200,
      message: "getMe successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateMe = async (req, res, next) => {
  try {
    if (req.files) {
      if (req?.files["panCard"]) {
        req.body.panCard = req.files["panCard"][0]["location"];
      }
      if (req?.files["aadharCard"]) {
        req.body.aadharCard = req.files["aadharCard"][0]["location"];
      }
      if (req?.files["anyOtherCompanySpecificId"]) {
        req.body.anyOtherCompanySpecificId =
          req.files["anyOtherCompanySpecificId"][0]["location"];
      }
      if (req?.files["profilePic"]) {
        req.body.profilePic = req.files["profilePic"][0]["location"];
      }
    }
    const data = await service.update(req.body, {
      where: {
        id: req.requestor.id,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Profile Updated Successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.getAll = async (req, res, next) => {
  try {
    const data = await service.get();

    res.status(200).send({
      status: 200,
      message: "getAll data successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
