const service = require("./service");
const adminModel = require("../admin/model");
//const userModel = require("../user/model");
exports.create = async (req, res, next) => {
  try {
    const data = await service.create({ name: req.body.name });
    const adminData = await adminModel.create({
      email: req.body.email,
      password: req.body.password,
      organizationId: data.id,
    });

    res.status(201).json({
      status: "success",
      message: "Add Organization successfully",
      data,
      adminData,
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
    const data = await service.get();

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

    const data = await service.update(req.body, {
      where: {
        id,
      },
    });

    res.status(203).send({
      status: "success",
      message: "Edit Organization successfully",
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
      },
    });

    res.status(200).send({
      status: "success",
      message: "delete organization successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
