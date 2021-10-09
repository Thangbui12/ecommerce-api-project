import express from "express";

import { createOrder } from "../controllers/order/order.controller";

const router = express.Router();

export default (confixRouter) => {
  confixRouter.use("/orders", router);

  router.post("/create-order", createOrder);
};
