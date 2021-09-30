import express from "express";
import { validationResult } from "express-validator";

import { createUser, loginUser } from "../controllers/user/user.controller";
import {
  createUserValidator,
  validatorResult,
} from "../controllers/user/user.validator";

//Router
const router = express.Router();

export default (app) => {
  app.use("/api/", router);

  app.get("/", (req, res) => {
    res.send("Welcome to HOME Shop!");
  });

  //Authentication
  router.post("/register", createUserValidator, validatorResult, createUser);
  // router.post("/register", createUser);
  router.post("/login", loginUser);
  router.post("/forgot");
};
