import { body, check, validationResult } from "express-validator";

export const createUserValidator = [
  check("username")
    .not()
    .isEmpty()
    .isLength(7)
    .isAlphanumeric()
    .withMessage("Username is required"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength(8)
    .withMessage("Password is too short")
    .matches(/\d/)
    .withMessage("Password must contain number"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email format is incorrect"),
];
