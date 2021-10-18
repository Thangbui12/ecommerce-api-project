import { body, check } from "express-validator";

export const createUserValidator = [
  body("username")
    .not()
    .isEmpty()
    .isLength(7)
    .withMessage("Username minLength 7")
    .bail()
    .isAlphanumeric()
    .withMessage("Username is required"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength(8)
    .withMessage("Password is too short")
    .matches(/\d/)
    .withMessage("Password must contain number"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email format is incorrect"),
];
