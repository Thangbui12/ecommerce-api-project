import express from "express";

import {
  createFlashSale,
  getAllFlashSale,
  getOneFlashSale,
  updateOneFlashSale,
  deleteOneFlashSale,
} from "../controllers/flashSale/flashSale.controller";
import { createFlashSaleValidator } from "../controllers/flashSale/flashSale.validator";
import { verifyToken } from "../middlewares/authToken";
import { checkAdminRole } from "../middlewares/checkRole";
import { validatorRequest } from "../middlewares/validator";

const router = express.Router();

export default (confixRouter) => {
  confixRouter.use("/flash-sales", verifyToken, checkAdminRole, router);

  router
    .post(
      "/create-flash-sale",
      createFlashSaleValidator,
      validatorRequest,
      createFlashSale
    )
    .get("/", getAllFlashSale)
    .get("/:id", getOneFlashSale)
    .patch("/:id", updateOneFlashSale)
    .delete("/:id", deleteOneFlashSale);
};
