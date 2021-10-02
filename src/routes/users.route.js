import express from "express";

import {
  getAllUsers,
  getOneUser,
  deleteOneUser,
} from "../controllers/user/user.controller";
import verifyToken from "../middlewares/authToken";
import { checkAdminRole } from "../middlewares/checkRole";

const router = express.Router();

export default (confixRouter) => {
  confixRouter.use("/users", verifyToken, router);

  router.get("/", checkAdminRole, getAllUsers);
  router.get("/:slug", checkAdminRole, getOneUser);
  router.delete("/:slug", checkAdminRole, deleteOneUser);
};
