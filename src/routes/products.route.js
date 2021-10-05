import express from "express";

import {
  createOneProduct,
  getAllProducts,
  getOneProduct,
  uploadPhotos,
  updateOneProduct,
  deleteOneProduct,
} from "../controllers/product/product.controller";
import { productValidator } from "../controllers/product/product.validator";
import verifyToken from "../middlewares/authToken";
import { checkAdminRole } from "../middlewares/checkRole";
import { resizeProductPhoto, uploadProductPhoto } from "../middlewares/photo";

const router = express.Router();

export default (confixRouter) => {
  confixRouter.use("/products/", router);

  router.post(
    "/create-product",
    verifyToken,
    checkAdminRole,
    productValidator,
    createOneProduct
  );

  router.get("/", getAllProducts);
  router
    .get("/:id", getOneProduct)
    .patch("/:id", verifyToken, checkAdminRole, updateOneProduct)
    .delete("/:id", verifyToken, checkAdminRole, deleteOneProduct);

  router.patch(
    "/:id/upload-photos",
    verifyToken,
    checkAdminRole,
    uploadProductPhoto,
    resizeProductPhoto,
    uploadPhotos
  );
};
