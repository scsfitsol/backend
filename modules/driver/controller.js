const service = require("./service");
//const userModel = require("../user/model");
exports.create = async (req, res, next) => {
  try {
    req.body.adminId = req.requestor.id;
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
        adminId: req.requestor.id,
      },
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
      where: {
        adminId: req.requestor.id,
      },
    });

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
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
        adminId: req.requestor.id,
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
        adminId: req.requestor.id,
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
