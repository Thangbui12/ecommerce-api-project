import mongoose from "mongoose";
import slugify from "slugify";

import Category from "../models/category.model";
import QueryFeatures from "../ultils/queryFeatures";

export const createCategoryService = async (body) => {
  const response = {
    statusCode: 201,
    message: "Created category success!",
    data: {},
  };

  const { name, banner, position } = await body;
  const slug = slugify(name, { lower: true, trim: true });
  try {
    //check category existed
    const categoryNameExisted = await Category.findOne({ name });
    const categorySlugExised = await Category.findOne({ slug });

    if (!!categoryNameExisted && !!categorySlugExised) {
      return {
        statusCode: 201,
        message: "Category Existed!",
        data: {},
      };
    }

    const categoryRequired = {
      _id: mongoose.Types.ObjectId(),
      name,
      slug,
      banner,
      position,
    };
    const newCategory = await Category.create(categoryRequired);

    response.data = newCategory;
  } catch (err) {
    response.statusCode = 500;
    response.message = err.message;
  }

  return response;
};

export const getAllCategoriesService = async (query) => {
  const response = {
    statusCode: 200,
    message: "Get all category success!",
    data: {},
  };

  try {
    const features = new QueryFeatures(Category.find(), query)
      .filter()
      .sort()
      .limitfields()
      .pagination();

    //Excute query
    const categories = await features.query;
    response.data = categories;
  } catch (err) {
    response.statusCode = 500;
    response.message = err.message;
  }
  return response;
};

export const getOneCategoryService = async (params) => {
  const response = {
    statusCode: 200,
    message: "Get one category success!",
    data: {},
  };
  const { id } = await params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return {
        statusCode: 404,
        message: "Category not existed!",
      };
    }

    response.data = category;
  } catch (err) {
    response.statusCode = 500;
    response.message = err.message;
  }

  return response;
};

export const updateOneCategoryService = async (req) => {
  const response = {
    statusCode: 200,
    message: "Updated category success",
    data: {},
  };

  const { id } = req.params;
  const { ...categoryParams } = req.body;
  try {
    //check category existed
    const category = await Category.findById({ _id: id });
    if (!category) {
      return {
        statusCode: 404,
        message: "Category not existed!",
      };
    }

    await category.updateOne(categoryParams);
    response.data = categoryParams;
  } catch (err) {
    response.statusCode = 500;
    response.message = err.message;
  }

  return response;
};

export const deleteOneCategoryService = async (req) => {
  const response = {
    statusCode: 200,
    message: "Delete category success!",
  };

  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    return {
      statusCode: 404,
      message: "Product not existed!",
    };
  }
  await category.delete();

  return response;
};

export const uploadCategoryBannerService = async (req) => {
  const response = {
    statusCode: 200,
    message: "Delete category success!",
    data: {},
  };

  const { id } = await req.params;
  const imgFile = await req.file;
  if (!id) {
    return {
      statusCode: 405,
      message: "Category not existed!",
    };
  }

  if (!imgFile) {
    return {
      statusCode: 404,
      message: "File Error!",
    };
  }
  const filename = await req.file.filename;

  const category = await Category.findByIdAndUpdate(
    id,
    { banner: filename },
    {
      new: true,
      runValidators: true,
    }
  );
  response.data = category;

  return response;
};
