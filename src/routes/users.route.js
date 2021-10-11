import express from "express";

import {
  getAllUsers,
  getOneUser,
  deleteOneUser,
  uploadAvatarUser,
} from "../controllers/user/user.controller";
import { verifyToken } from "../middlewares/authToken";
import { checkAdminRole } from "../middlewares/checkRole";
import { resizeUserPhoto, uploadUserPhoto } from "../middlewares/photo";

const router = express.Router();

export default (confixRouter) => {
  // localhost:5035/api/users
  confixRouter.use("/users", verifyToken, router);

  // localhost:5035/api/users/
  router
    .get("/", checkAdminRole, getAllUsers)
    .get("/:slug", checkAdminRole, getOneUser)
    .delete("/:slug", checkAdminRole, deleteOneUser)
    .patch(
      "/:id/upload-avatar",
      uploadUserPhoto,
      resizeUserPhoto,
      uploadAvatarUser
    );
};
