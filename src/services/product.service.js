import mongoose from "mongoose";
import slugify from "slugify";

import Product from "../models/product.model";
import QueryFeatures from "../ultils/queryFeatures";

export const createOneProductService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Created product success!",
    data: {},
  };
  const {
    name,
    price,
    barcode,
    categories,
    weight,
    images,
    quantity,
    description,
    brand,
  } = await req.body;

  try {
    // check product existed barcode existed
    const productNameExisted = await Product.findOne({ name });
    const productBarcodeExisted = await Product.findOne({ barcode });

    if (!!productNameExisted && !!productBarcodeExisted) {
      return {
        statusCode: 404,
        message: "Product not existed!",
      };
    }
    const productRequired = {
      _id: mongoose.Types.ObjectId(),
      name,
      slug: slugify(name, { lower: true }),
      price,
      barcode,
      categories,
      weight,
      quantity,
      description,
      brand,
    };

    const newProduct = await Product.create(productRequired);

    res.data = newProduct;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const getAllProductsService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Get all products success!",
    data: {},
  };
  try {
    const features = new QueryFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .pagination();

    //Execute query
    const products = await features.query
      .populate({
        path: "categories",
        select: ["name", "position", "banner", "isActive"],
      })
      .populate({
        path: "flashSale",
        select: [
          "quantity",
          "discountPercent",
          "timeStart",
          "duration",
          "timeEnd",
        ],
      });
    res.data = products;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const getOneProductService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Get product success!",
    data: {},
  };
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });
    if (!product) {
      return {
        statusCode: 404,
        message: "Product not existed!",
      };
    }

    res.data = product;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const updateOneProductService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Updated product success!",
    data: {},
  };
  const { id } = await req.params;
  const { ...productParams } = await req.body;
  try {
    //Check product existed
    const product = await Product.findById({ _id: id });

    if (!product) {
      return {
        statusCode: 404,
        message: "Product not existed!",
      };
    }

    await product.updateOne(productParams);
    res.data = productParams;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }
  return res;
};

export const deleteOneProductService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Deleted product success!",
  };
  const { id } = req.params;

  try {
    const product = await Product.findById({ _id: id });

    if (!product) {
      return {
        statusCode: 404,
        message: "Product not existed!",
      };
    }
    await product.delete();
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }
};

export const uploadPhotosService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Uploaded product's image",
    data: {},
  };
  const { id } = req.params;
  const imgFile = req.files;

  try {
    if (!imgFile) {
      return {
        statusCode: 404,
        message: "File Error!",
      };
    }

    if (!id) {
      return {
        statusCode: 405,
        message: "Product not existed!",
      };
    }

    const filenames = [];
    imgFile.forEach((el, index) => {
      filenames.push(el.filename);
    });

    const product = await Product.findByIdAndUpdate(
      id,
      { images: filenames },
      {
        new: true,
        runValidators: true,
      }
    );
    res.data = product.images;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};
