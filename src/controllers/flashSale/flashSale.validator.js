import { check } from "express-validator";

export const createFlashSaleValidator = [
  check("name")
    .notEmpty()
    .isLength(30)
    .isAlphanumeric()
    .withMessage("Flash Sale's name required"),
  check("quantity").notEmpty().isNumeric().withMessage("Quantity required"),
  check("discountPercent")
    .notEmpty()
    .isNumeric()
    .withMessage("Discount Percent required"),
];
