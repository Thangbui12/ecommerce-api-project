import mongoose, { Query } from "mongoose";
import moment from "moment";
import _ from "lodash";

import FlashSale from "../../models/flashSale.model";
import Product from "../../models/product.model";
import QueryFeatures from "../../ultils/queryFeatures";

export const createFlashSale = async (req, res) => {
  const { name, productId, quantity, discountPercent, timeStart, duration } =
    req.body;
  const flashSaleId = mongoose.Types.ObjectId();

  //time: 2021-10-09 09:30:26.123 (yeart-month-day hour-minute-second.minisecond)
  //duration : 2days-2d 20minutes-20m 20seconds-20s 2hours-2h 2months-2M 2years-2y Quanter-Q
  //moment('24/12/2019 09:15:00', "DD MM YYYY hh:mm:ss", true);
  // console.log(duration);

  const timeStartCoverted = await moment(timeStart);
  const timeEndConverted = await timeStartCoverted.add(
    _.split(duration, "", 2)[0],
    _.split(duration, "", 2)[1]
  );
  // console.log(timeEndConverted);
  //Check product Id existed in another flashSale
  //check Name of flashSale existed
  const flashSaleNameExisted = await FlashSale.findOne({ name });
  if (!flashSaleNameExisted) {
    //check & delete productId if req.body.productId existed in another FlashSale before create the new
    //New Flash Sale
    const flashSaleRequired = {
      _id: flashSaleId,
      name,
      productId,
      quantity,
      discountPercent,
      timeStart,
      duration,
      timeEnd: timeEndConverted,
    };
    const newFlashSale = await FlashSale.create(flashSaleRequired);

    // Update Product database handle
    const productUpdate = await Promise.all(
      productId.map(async (id) => {
        const product = await Product.findById({ _id: id });
        // console.log(product.price);
        if (!product) {
          res.status(404).json({
            statusCode: 404,
            message: "Product incorrect!",
            data: {},
          });
        }
        // const flashSalePrice =
        //   (await (product.price * 1)) * ((100 - discountPercent) / 100);
        // console.log(flashSalePrice);

        //update flashSale and flashSalePrice
        await Product.findByIdAndUpdate(
          id,
          {
            flashSale: flashSaleId,
            // flashSalePrice: flashSalePrice,
          },
          {
            new: true,
            runValidators: true,
          }
        );
        return {
          flashSale: flashSaleId,
          // flashSalePrice: flashSalePrice,
        };
      })
    );

    res.status(200).json({
      statusCode: 200,
      message: "updated flash sale to product datebase success!",
      productUpdate: {
        productUpdate,
      },
      message: "Create flash sale success!",
      data: {
        newFlashSale,
      },
    });
  } else {
    res.status(500).json({
      statusCode: 500,
      message: "Flash Sale existed! Make a new flash sale",
      data: {},
    });
  }
};

export const getAllFlashSale = async (req, res) => {
  try {
    const features = new QueryFeatures(FlashSale.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .pagination();

    //Excute query
    const flashSales = await features.query.populate({
      path: "productId",
      select: ["price", "name"],
    });

    res.status(200).json({
      statusCode: 200,
      totalProducts: flashSales.length,
      message: "Get all flash sales successfully",
      data: {
        flashSales,
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

//Get one flash sale

export const getOneFlashSale = async (req, res) => {
  const { id } = await req.params;

  const flashSale = await FlashSale.findById({ _id: id }).populate({
    path: "productId",
    select: ["price", "flashSalePrice", "name"],
  });
  console.log(flashSale);
  if (!flashSale) {
    return res.status(404).json({
      statusCode: 404,
      message: "flash sale not existed!",
      data: {},
    });
  }

  res.status(200).json({
    statusCode: 200,
    message: "Get flash sale successfully",
    data: {
      flashSale,
    },
  });
};

// Update One Flash Sale
export const updateOneFlashSale = async (req, res) => {
  const { id } = await req.params;
  const { ...flashSaleParams } = req.body;

  const flashSale = await FlashSale.findById({ _id: id });
  if (!flashSale) {
    return res.status(404).json({
      statusCode: 404,
      message: "Flash Sale not existed!",
      data: {},
    });
  }

  await flashSale.updateOne(flashSaleParams);
  res.status(200).json({
    statusCode: 200,
    message: "Updated Flash Sale successfully",
    data: {
      updated: flashSaleParams,
    },
  });
};

//Delete One Flash Sale
export const deleteOneFlashSale = async (req, res) => {
  const { id } = req.params;

  const flashSale = await FlashSale.findById({ _id: id });

  if (!flashSale) {
    return res.status(404).json({
      statusCode: 404,
      message: "Product not existed!",
      data: {},
    });
  }

  await flashSale.delete();
  res.status(200).json({
    statusCode: 200,
    message: "Delete product successfully",
  });
};
