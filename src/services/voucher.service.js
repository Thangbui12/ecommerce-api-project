import moment from "moment";
import mongoose from "mongoose";

import Voucher from "../models/voucher.model";
import QueryFeatures from "../ultils/queryFeatures";

export const createVoucherService = async (req) => {
  const res = {
    statusCode: 201,
    message: "Created voucher success!",
    data: {},
  };
  const { ...voucherParams } = await req.body;

  try {
    if (moment(voucherParams.timeStart) >= moment(voucherParams.timeEnd)) {
      return {
        statusCode: 500,
        message: "Time Expires Incorrect!",
      };
    }

    const voucherCodeExisted = await Voucher.findOne({
      code: voucherParams.code,
    });
    if (!!voucherCodeExisted) {
      return {
        statusCode: 500,
        message: "Voucher Existed!",
      };
    }
    const voucherRequired = {
      _id: mongoose.Types.ObjectId(),
      ...voucherParams,
    };

    const newVoucher = await Voucher.create(voucherRequired);

    res.data = newVoucher;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const getAllVoucherService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Get all voucher success!",
    data: {},
  };
  try {
    const features = new QueryFeatures(Voucher.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .pagination();

    //Excute query
    const vouchers = await features.query;

    res.data = vouchers;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const getOneVoucherService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Get voucher success!",
    data: {},
  };
  const { id } = req.params;
  try {
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return {
        statusCode: 404,
        message: "Voucher not existed!",
      };
    }
    res.data = voucher;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const updateOneVoucherService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Updated voucher success!",
    data: {},
  };
  const { id } = await req.params;

  try {
    const { ...voucherParams } = req.body;

    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return {
        statusCode: 404,
        message: "Voucher not existed!",
      };
    }

    await Voucher.updateOne(voucherParams);
    res.data = { ...voucherParams };
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const deleteOneVoucherService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Deleted voucher success!",
  };

  const { id } = await req.params;

  try {
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return {
        statusCode: 404,
        message: "Voucher not existed!",
      };
    }
    await voucher.delete();
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};
