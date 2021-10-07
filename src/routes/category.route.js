import express from "express";

import {
  createCategory,
  getAllCategories,
  getOneCategory,
  updateOneCategory,
  deleteOneCategory,
  uploadCategoryBanner,
} from "../controllers/category/category.controller";
import verifyToken from "../middlewares/authToken";
import { checkAdminRole } from "../middlewares/checkRole";
import { resizeBanner, uploadBanner } from "../middlewares/photo";

const router = express.Router();

export default (confixRouter) => {
  confixRouter.use("/categories", verifyToken, checkAdminRole, router);

  router
    .post("/create-category", createCategory)
    .get("/", getAllCategories)
    .get("/:id", getOneCategory)
    .patch("/:id", updateOneCategory)
    .delete("/:id", deleteOneCategory)
    .patch(
      "/upload-banner/:id",
      uploadBanner,
      resizeBanner,
      uploadCategoryBanner
    );
};
