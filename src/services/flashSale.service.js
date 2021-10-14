import mongoose from "mongoose";
import moment from "moment";
import _ from "lodash";

import FlashSale from "../models/flashSale.model";
import Product from "../models/product.model";
import QueryFeatures from "../ultils/queryFeatures";
import { sendMailCron } from "../ultils/cron-job";

export const createFlashSaleService = async (req) => {
  const response = {
    statusCode: 201,
    message: "Created flash sale success!",
    data: {},
  };

  const { name, productId, quantity, discountPercent, timeStart, duration } =
    req.body;
  const flashSaleId = mongoose.Types.ObjectId();

  //time: 2021-10-09 09:30:26.123 (yeart-month-day hour-minute-second.minisecond)
  //duration : 2days-2d 20minutes-20m 20seconds-20s 2hours-2h 2months-2M 2years-2y Quanter-Q
  //moment('24/12/2019 09:15:00', "DD MM YYYY hh:mm:ss", true);

  const timeStartCoverted = moment(timeStart);
  const timeEndConverted = timeStartCoverted.add(
    _.split(duration, "", 2)[0],
    _.split(duration, "", 2)[1]
  );
  try {
    //Check product Id existed in another flashSale
    //check Name of flashSale existed
    const flashSaleNameExisted = await FlashSale.findOne({ name });
    if (!!flashSaleNameExisted) {
      return {
        statusCode: 404,
        message: "Flash sale existed!",
      };
    }

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
    productId.map(async (id) => {
      const product = await Product.findById({ _id: id });
      if (!product) {
        return {
          statusCode: 404,
          message: "Product incorrect!",
        };
      }

      await Product.findByIdAndUpdate(
        id,
        {
          flashSale: flashSaleId,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return {
        flashSale: flashSaleId,
      };
    });

    sendMailCron();

    response.data = newFlashSale;
  } catch (err) {
    response.statusCode = 500;
    response.message = err.message;
  }

  return response;
};

export const getAllFlashSaleService = async (req) => {
  const response = {
    statusCode: 200,
    message: "Get all flash sale success!",
    data: {},
  };

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

    response.data = flashSales;
  } catch (err) {
    response.statusCode = 500;
    response.message = err.message;
  }

  return response;
};

export const getOneFlashSaleService = async (req) => {
  const response = {
    statusCode: 200,
    message: "Get flash sale success!",
    data: {},
  };

  const { id } = await req.params;
  try {
    const flashSale = await FlashSale.findById(id).populate({
      path: "productId",
      select: ["price", "flashSalePrice", "name"],
    });

    if (!flashSale) {
      return {
        statusCode: 404,
        message: "flash sale not existed!",
      };
    }

    response.data = flashSale;
  } catch (err) {
    response.statusCode = 500;
    response.message = err.message;
  }

  return response;
};

export const updateOneFlashSaleService = async (req) => {
  const response = {
    statusCode: 200,
    message: "Update flash sale success!",
    data: {},
  };
  const { id } = await req.params;
  const { ...flashSaleParams } = req.body;

  try {
    const flashSale = await FlashSale.findById(id);
    if (!flashSale) {
      return {
        statusCode: 404,
        message: "Flash Sale not existed!",
        data: {},
      };
    }

    await flashSale.updateOne(flashSaleParams);
    response.data = flashSaleParams;
  } catch (err) {
    response.statusCode = 500;
    response.message = err.message;
  }

  return response;
};

export const deleteOneFlashSaleService = async (req) => {
  const response = {
    statusCode: 200,
    message: "Delete flash sale success!",
  };
  const { id } = req.params;
  try {
    const flashSale = await FlashSale.findById(id);

    if (!flashSale) {
      return {
        statusCode: 404,
        message: "Product not existed!",
      };
    }

    await flashSale.delete();
  } catch (err) {
    response.statusCode = 500;
    response.message = err.message;
  }

  return response;
};
