import { check } from "express-validator";

export const createOrderValidator = [
  check("items").notEmpty().withMessage("Items required"),
  check("adress").notEmpty().withMessage("Address required"),
];
