import { check } from "express-validator";

export const createVoucherValidator = [
  check("code")
    .notEmpty()
    .isLength(30)
    .isAlphanumeric()
    .withMessage("Code is required"),
  check("quantity").notEmpty().isNumeric().withMessage("Quantity is required"),
  check("discount").notEmpty().isNumeric().withMessage("Discount is required"),
  check("timeStart").notEmpty().withMessage("Time start required"),
  check("timeEnd").notEmpty().withMessage("Time end required"),
];
