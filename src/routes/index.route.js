import express from "express";

import {
  createUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/user/user.controller";
import {
  createUserValidator,
  validatorResult,
} from "../controllers/user/user.validator";
import usersRoute from "./users.route";

//Router
const router = express.Router();

export default (app) => {
  app.use("/api/", router);

  app.get("/", (req, res) => {
    res.send("Welcome to HOME Shop!");
  });

  //Authentication
  router.post("/register", createUserValidator, validatorResult, createUser);
  router.post("/login", loginUser);
  router.get("/logout", logoutUser);
  router.put("/forgot-password", forgotPassword);
  router.post("/reset-password/:token", resetPassword);

  // router api/users
  usersRoute(router);
};
