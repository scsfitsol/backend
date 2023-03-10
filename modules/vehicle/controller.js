const service = require("./service");
const { sqquery } = require("../../utils/query");
const Organization = require("../organization/model");
const Transporter = require("../transporter/model");
exports.create = async (req, res, next) => {
  try {
    req.body.organizationId =
      req?.requestor?.organizationId || req?.query?.organizationId;
    const data = await service.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Add vehicle successfully",
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
      include: [
        {
          model: Organization,
        },
        { model: Transporter },
      ],
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
    req.query.organizationId =
      req?.requestor?.organizationId || req?.query?.organizationId;
    const data = await service.get({
      ...sqquery(req.query),
      include: [
        {
          model: Organization,
        },
        { model: Transporter },
      ],
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

    const data = await service.update(req.body, {
      where: {
        id,
        organizationId:
          req?.requestor?.organizationId || req?.query?.organizationId,
      },
    });

    res.status(203).send({
      status: "success",
      message: "Edit vehicle successfully",
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
      message: "delete vehicle successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
