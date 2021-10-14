import {
  createCategoryService,
  getAllCategoriesService,
  getOneCategoryService,
  updateOneCategoryService,
  deleteOneCategoryService,
  uploadCategoryBannerService,
} from "../../services/category.service";

export const createCategory = async (req, res) => {
  const { statusCode, message, data } = await createCategoryService(req.body);
  return res.status(statusCode).json({ message, data });
};

export const getAllCategories = async (req, res) => {
  const { statusCode, message, data } = await getAllCategoriesService(
    req.query
  );
  return res.status(statusCode).json({ message, data });
};

export const getOneCategory = async (req, res) => {
  const { statusCode, message, data } = await getOneCategoryService(req.params);
  return res.status(statusCode).json({ message, data });
};

export const updateOneCategory = async (req, res) => {
  const { statusCode, message, data } = await updateOneCategoryService(req);
  return res.status(statusCode).json({ message, data });
};

export const deleteOneCategory = async (req, res) => {
  const { statusCode, message, data } = await deleteOneCategoryService(req);
  return res.status(statusCode).json({ message, data });
};

//upload banner for category

export const uploadCategoryBanner = async (req, res) => {
  const { statusCode, message, data } = await uploadCategoryBannerService(req);
  return res.status(statusCode).json({ message, data });
};
