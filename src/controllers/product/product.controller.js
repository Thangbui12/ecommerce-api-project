import {
  createOneProductService,
  deleteOneProductService,
  getAllProductsService,
  getOneProductService,
  updateOneProductService,
  uploadPhotosService,
} from "../../services/product.service";

//Create one product
export const createOneProduct = async (req, res) => {
  const { statusCode, message, data } = await createOneProductService(req);
  return res.status(statusCode).json({ message, data });
};

export const getAllProducts = async (req, res) => {
  const { statusCode, message, data } = await getAllProductsService(req);
  return res.status(statusCode).json({ message, data });
};

export const getOneProduct = async (req, res) => {
  const { statusCode, message, data } = await getOneProductService(req);
  return res.status(statusCode).json({ message, data });
};

export const updateOneProduct = async (req, res) => {
  const { statusCode, message, data } = await updateOneProductService(req);
  return res.status(statusCode).json({ message, data });
};

export const deleteOneProduct = async (req, res) => {
  const { statusCode, message, data } = await deleteOneProductService(req);
  return res.status(statusCode).json({ message, data });
};

export const uploadPhotos = async (req, res) => {
  const { statusCode, message, data } = await uploadPhotosService(req);
  return res.status(statusCode).json({ message, data });
};
