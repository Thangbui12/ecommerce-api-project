import express from "express";

import {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/user/user.controller";
import {
  createUserValidator,
  validatorResult,
} from "../controllers/user/user.validator";
import usersRoute from "./users.route";
import productRoute from "./products.route";
import categoryRoute from "./category.route";
import orderRoute from "./order.route";
import flashSaleRoute from "./flashSale.route";
import voucherRoute from "./voucher.route";
//Router
const router = express.Router();

export default (app) => {
  app.use("/api/", router);

  app.get("/", (req, res) => {
    res.send("Welcome to HOME Shop!");
  });

  //Authentication
  router
    .post("/register", createUserValidator, validatorResult, createUser)
    .post("/login", loginUser)
    .put("/forgot-password", forgotPassword)
    .post("/reset-password/:token", resetPassword);

  //Get all products

  //Router api/users/
  usersRoute(router);

  // router api/products/
  productRoute(router);

  // category api/categories/
  categoryRoute(router);

  // Order api/orders/
  orderRoute(router);

  // FlashSale api/flash-sales/
  flashSaleRoute(router);

  // Voucher api/vouchers/
  voucherRoute(router);
};
