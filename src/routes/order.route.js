import express from "express";

import {
  createOrder,
  getAllOrder,
  getOneOrder,
  updateOneOrder,
  deleteOneOrder,
} from "../controllers/order/order.controller";
import { createOrderValidator } from "../controllers/order/order.validator";
import { verifyToken } from "../middlewares/authToken";
const router = express.Router();

export default (confixRouter) => {
  confixRouter.use("/orders", verifyToken, router);

  router
    .post("/create-order", createOrderValidator, createOrder)
    .get("/", getAllOrder)
    .get("/:id", getOneOrder)
    .patch("/:id", updateOneOrder)
    .delete("/:id", deleteOneOrder);
};
