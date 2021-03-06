import express from "express";

import {
  createVoucher,
  getAllVoucher,
  getOneVoucher,
  updateOneVoucher,
  deleteOneVoucher,
} from "../controllers/voucher/voucher.controller";
import { createVoucherValidator } from "../controllers/voucher/voucher.validator";
import { verifyToken } from "../middlewares/authToken";
import { checkAdminRole } from "../middlewares/checkRole";
import { validatorRequest } from "../middlewares/validator";

const router = express.Router();

export default (confixRouter) => {
  confixRouter.use("/vouchers", verifyToken, checkAdminRole, router);

  router
    .post(
      "/create-voucher",
      createVoucherValidator,
      validatorRequest,
      createVoucher
    )
    .get("/", getAllVoucher)
    .get("/:id", getOneVoucher)
    .patch("/:id", updateOneVoucher)
    .delete("/:id", deleteOneVoucher);
};
