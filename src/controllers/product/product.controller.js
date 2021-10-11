import mongoose from "mongoose";
import slugify from "slugify";

import Product from "../../models/product.model";
import QueryFeatures from "../../ultils/queryFeatures";

//Create one product
export const createOneProduct = async (req, res) => {
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

  // check product existed barcode existed
  const productNameExisted = await Product.findOne({ name });
  const productBarcodeExisted = await Product.findOne({ barcode });

  if (!productNameExisted && !productBarcodeExisted) {
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

    res.status(201).json({
      statusCode: 201,
      message: "Created product success!",
      data: {
        product: newProduct,
      },
    });
  } else {
    res.status(500).json({
      statusCode: 500,
      message: "Product Existed!",
      data: {},
    });
  }
};

//get All products index router
export const getAllProducts = async (req, res) => {
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
    res.status(200).json({
      statusCode: 200,
      totalProducts: products.length,
      message: "Get all products successfully",
      data: {
        products,
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

//get one product
export const getOneProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });
    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        message: "Product not existed!",
        data: {},
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Get product successfully",
      data: {
        product,
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

//update one product
export const updateOneProduct = async (req, res) => {
  const { id } = await req.params;
  const { ...productParams } = await req.body;
  // console.log(productParams);

  //Check product existed
  const product = await Product.findById({ _id: id });

  if (!product) {
    return res.status(404).json({
      statusCode: 404,
      message: "Product not existed!",
      data: {},
    });
  }

  await product.updateOne(productParams);
  res.status(200).json({
    statusCode: 200,
    message: "Updated product successfully",
    data: {
      updated: productParams,
    },
  });
};

// Delete product
export const deleteOneProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById({ _id: id });

  if (!product) {
    return res.status(404).json({
      statusCode: 404,
      message: "Product not existed!",
      data: {},
    });
  }

  await product.delete();
  res.status(200).json({
    statusCode: 200,
    message: "Delete product successfully",
  });
};

//Upload photos for product
export const uploadPhotos = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const imgFile = await req.files;
  // console.log(imgFile);
  // console.log(typeof imgFile);
  if (!imgFile) {
    return res.status(404).json({
      statusCode: 404,
      message: "File Error!",
      data: {},
    });
  }

  if (!id) {
    return res.status(405).json({
      statusCode: 405,
      message: "Product not existed!",
      data: {},
    });
  }

  const filenames = [];
  await imgFile.forEach((el, index) => {
    filenames.push(el.filename);
  });
  // console.log(filenames);

  const product = await Product.findByIdAndUpdate(
    id,
    { images: filenames },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    statusCode: 200,
    message: "Upload img success!",
    data: {
      images: product.images,
    },
  });
};
