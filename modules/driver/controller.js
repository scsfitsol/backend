const service = require("./service");
const { sqquery } = require("../../utils/query");
const Organization = require("../organization/model");
//const userModel = require("../user/model");
exports.create = async (req, res, next) => {
  try {
    if (req.body.mobile) {
      const [driverWithSamePhoneNo] = await service.get({
        where: { mobile: req.body.mobile },
      });
      // driver with same phone number is  found.
      if (driverWithSamePhoneNo) {
        return res.status(400).json({
          message: "This Phone Number is already register,try with another one",
        });
      }
    }

    req.body.organizationId =
      req?.requestor?.organizationId || req?.query?.organizationId;
    if (req.file) {
      req.body.drivingLicense = req.file.location;
    }
    const data = await service.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Add Driver successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const data = await service.get({
      where: {
        id: req.params.id,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
      include: [Organization],
    });

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
exports.getAll = async (req, res, next) => {
  try {
    const data = await service.get({
      organizationId:
        req?.requestor?.organizationId || req?.query?.organizationId,
      ...sqquery(req.query),
      include: [Organization],
    });

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log("error----->", error);
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (req.file) {
      req.body.drivingLicense = req.file.location;
    }
    const data = await service.update(req.body, {
      where: {
        id,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });

    res.status(203).send({
      status: "success",
      message: "Edit driver successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;

    const data = await service.remove({
      where: {
        id,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });

    res.status(200).send({
      status: "success",
      message: "delete driver successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
