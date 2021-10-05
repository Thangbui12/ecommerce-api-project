import { body, check, validationResult } from "express-validator";

export const productValidator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Product's name required!")
    .isAlphanumeric()
    .withMessage("Product name must contain at no special symbol"),
  check("price")
    .not()
    .isEmpty()
    .withMessage("Price required!")
    .isFloat()
    .withMessage("Price must contain float number"),
  check("barcode")
    .not()
    .isEmpty()
    .withMessage("Barcode required!")
    .isAlphanumeric()
    .withMessage("No contain at special symbol"),
  check("weight").not().isEmpty().withMessage("Weight required!"),
  check("quantity")
    .not()
    .isEmpty()
    .withMessage("Quantity required!")
    .isFloat()
    .withMessage("Quantity must be float"),
  check("description")
    .not()
    .isEmpty()
    .withMessage("Description required!")
    .isLength(1500)
    .withMessage("With leght is 1500 charaters"),
];
