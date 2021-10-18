import express from "express";

import {
  createCategory,
  getAllCategories,
  getOneCategory,
  updateOneCategory,
  deleteOneCategory,
  uploadCategoryBanner,
} from "../controllers/category/category.controller";
import { createCategoryValidator } from "../controllers/category/category.validator";
import { verifyToken } from "../middlewares/authToken";
import { checkAdminRole } from "../middlewares/checkRole";
import { resizeBanner, uploadBanner } from "../middlewares/photo";
import { validatorRequest } from "../middlewares/validator";

const router = express.Router();

export default (confixRouter) => {
  confixRouter.use("/categories", verifyToken, checkAdminRole, router);

  router
    .post(
      "/create-category",
      createCategoryValidator,
      validatorRequest,
      createCategory
    )
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
