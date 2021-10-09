import express from "express";

import {
  createFlashSale,
  getAllFlashSale,
  getOneFlashSale,
  updateOneFlashSale,
  deleteOneFlashSale,
} from "../controllers/flashSale/flashSale.controller";

const router = express.Router();

export default (confixRouter) => {
  confixRouter.use("/flash-sales", router);

  router
    .post("/create-flash-sale", createFlashSale)
    .get("/", getAllFlashSale)
    .get("/:id", getOneFlashSale)
    .patch("/:id", updateOneFlashSale)
    .delete("/:id", deleteOneFlashSale);
};
