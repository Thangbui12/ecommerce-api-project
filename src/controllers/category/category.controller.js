import mongoose from "mongoose";
import slugify from "slugify";

import Category from "../../models/category.model";
import QueryFeatures from "../../ultils/queryFeatures";

export const createCategory = async (req, res) => {
  const { name, banner, position } = await req.body;
  const slug = slugify(name, { lower: true, trim: true });
  //check category existed
  const categoryNameExisted = await Category.findOne({ name });
  const categorySlugExised = await Category.findOne({ slug });

  if (!categoryNameExisted && !categorySlugExised) {
    const categoryRequired = {
      _id: mongoose.Types.ObjectId(),
      name,
      slug,
      banner,
      position,
    };
    const newCategory = await Category.create(categoryRequired);

    res.status(201).json({
      statusCode: 201,
      message: "Create category success!",
      data: {
        category: newCategory,
      },
    });
  } else {
    res.status(500).json({
      statusCode: 500,
      message: "Category Existed!",
      data: {},
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const features = new QueryFeatures(Category.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .pagination();

    //Excute query
    const categories = await features.query;
    res.status(200).json({
      statusCode: 200,
      totalCategories: categories.length,
      message: "Get all products successfully",
      data: {
        categories,
      },
    });
  } catch (err) {
    res.status(404).json({
      statusCode: 404,
      message: err.message,
      data: {},
    });
  }
};

export const getOneCategory = async (req, res) => {
  const { id } = await req.params;
  console.log(id);
  try {
    const category = await Category.findById({ _id: id });
    // console.log(category);

    if (!category) {
      return res.status(404).json({
        statusCode: 404,
        message: "Category not existed!",
        data: {},
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Get category successfully",
      data: {
        category,
      },
    });
  } catch {
    return res.status(404).json({
      statusCode: 404,
      message: "Product not existed!",
      data: {},
    });
  }
};

export const updateOneCategory = async (req, res) => {
  const { id } = await req.params;
  const { ...categoryParams } = await req.body;

  console.log(categoryParams);
  try {
    //check category existed
    const category = await Category.findById({ _id: id });
    if (!category) {
      return res.status(404).json({
        statusCode: 404,
        message: "Category not existed!",
        data: {},
      });
    }

    await category.updateOne(categoryParams);
    res.status(200).json({
      statusCode: 200,
      message: "Updated category successfully!",
      data: {
        updated: categoryParams,
      },
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    });
  }
};

export const deleteOneCategory = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById({ _id: id });

  if (!category) {
    return res.status(404).json({
      statusCode: 404,
      message: "Product not existed!",
      data: {},
    });
  }

  await category.delete();
  res.status(200).json({
    statusCode: 200,
    message: "Delete category successfully",
  });
};

//upload banner for category

export const uploadCategoryBanner = async (req, res) => {
  const { id } = await req.params;

  const imgFile = await req.file;
  // console.log(id, filename);
  if (!id) {
    return res.status(405).json({
      statusCode: 405,
      message: "Category not existed!",
      data: {},
    });
  }

  if (!imgFile) {
    return res.status(404).json({
      statusCode: 404,
      message: "File Error!",
      data: {},
    });
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

  res.status(200).json({
    statusCode: 200,
    message: "Upload banner successfully!",
    data: {
      banner: category.banner,
    },
  });
};
