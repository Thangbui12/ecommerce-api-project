import { check } from "express-validator";

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category's name required")
    .isLength(50)
    .isAlpha()
    .withMessage("Category only allow Alphabet"),
];
