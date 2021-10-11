import express from "express";

import { createOrder } from "../controllers/order/order.controller";
import { verifyToken } from "../middlewares/authToken";
const router = express.Router();

export default (confixRouter) => {
  confixRouter.use("/orders", router);

  router.post("/create-order", verifyToken, createOrder);
};
