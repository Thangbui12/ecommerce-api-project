import express from "express";

import {
  createFlashSale,
  getAllFlashSale,
  getOneFlashSale,
  updateOneFlashSale,
  deleteOneFlashSale,
} from "../controllers/flashSale/flashSale.controller";
import { verifyToken } from "../middlewares/authToken";
import { checkAdminRole } from "../middlewares/checkRole";

const router = express.Router();

export default (confixRouter) => {
  confixRouter.use("/flash-sales", verifyToken, checkAdminRole, router);

  router
    .post("/create-flash-sale", createFlashSale)
    .get("/", getAllFlashSale)
    .get("/:id", getOneFlashSale)
    .patch("/:id", updateOneFlashSale)
    .delete("/:id", deleteOneFlashSale);
};
