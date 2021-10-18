import { validationResult } from "express-validator";

export const validatorRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).send({
      statusCode: 400,
      message: errors.array()[0].msg,
      data: {},
    });
  }

  next();
};
