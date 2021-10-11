import express from "express";

import {
  createVoucher,
  getAllVoucher,
  getOneVoucher,
  updateOneVoucher,
  deleteOneVoucher,
} from "../controllers/voucher/voucher.controller";
import { verifyToken } from "../middlewares/authToken";
import { checkAdminRole } from "../middlewares/checkRole";

const router = express.Router();

export default (confixRouter) => {
  confixRouter.use("/vouchers", verifyToken, checkAdminRole, router);

  router
    .post("/create-voucher", createVoucher)
    .get("/", getAllVoucher)
    .get("/:id", getOneVoucher)
    .patch("/:id", updateOneVoucher)
    .delete("/:id", deleteOneVoucher);
};
