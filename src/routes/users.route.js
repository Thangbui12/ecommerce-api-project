import express from "express";

import {
  getAllUsers,
  getOneUser,
  deleteOneUser,
} from "../controllers/user/user.controller";
import verifyToken from "../middlewares/authToken";

const router = express.Router();

export default (confixRouter) => {
  confixRouter.use("/users", verifyToken, router);

  router.get("/", getAllUsers);
  router.get("/:slug", getOneUser);
  router.delete("/:slug", deleteOneUser);
};
