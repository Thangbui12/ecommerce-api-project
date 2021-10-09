import moment from "moment";
import mongoose from "mongoose";

import Voucher from "../../models/voucher.model";
import QueryFeatures from "../../ultils/queryFeatures";

export const createVoucher = async (req, res) => {
  const { ...voucherParams } = await req.body;

  const voucherCodeExisted = await Voucher.findOne({
    code: voucherParams.code,
  });
  if (
    await (moment(voucherParams.timeStart) >= moment(voucherParams.timeEnd))
  ) {
    return res.status(500).json({
      statusCode: 500,
      message: "Time Expires Incorrect!",
      data: {},
    });
  }
  if (!!voucherCodeExisted) {
    return res.status(500).json({
      statusCode: 500,
      message: "Voucher Existed!",
      data: {},
    });
  }
  const voucherRequired = {
    _id: mongoose.Types.ObjectId(),
    ...voucherParams,
  };

  const newVoucher = await Voucher.create(voucherRequired);

  res.status(201).json({
    statusCode: 201,
    message: "Created voucher success!",
    data: {
      product: newVoucher,
    },
  });
};

//getAllVoucher
export const getAllVoucher = async (req, res) => {
  try {
    const features = new QueryFeatures(Voucher.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .pagination();

    //Excute query
    const vouchers = await features.query;

    res.status(200).json({
      statusCode: 200,
      totalProducts: vouchers.length,
      message: "Get all vouchers successfully",
      data: {
        vouchers,
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

export const getOneVoucher = async (req, res) => {
  const { id } = await req.params;

  const voucher = await Voucher.findById({ _id: id });
  if (!voucher) {
    return res.status(404).json({
      statusCode: 404,
      message: "Voucher not existed!",
      data: {},
    });
  }
  res.status(200).json({
    statusCode: 200,
    message: "Get Voucher successfully",
    data: {
      voucher,
    },
  });
};

export const updateOneVoucher = async (req, res) => {
  const { id } = await req.params;
  const { ...voucherParams } = await req.body;

  const voucher = await Voucher.findById({ _id: id });
  if (!voucher) {
    return res.status(404).json({
      statusCode: 404,
      message: "Voucher not existed!",
      data: {},
    });
  }

  await Voucher.updateOne(voucherParams);
  res.status(200).json({
    statusCode: 200,
    message: "Updated Voucher successfully",
    data: {
      updated: voucherParams,
    },
  });
};

export const deleteOneVoucher = async (req, res) => {
  const { id } = await req.params;
  const voucher = await Voucher.findById({ _id: id });
  if (!voucher) {
    return res.status(404).json({
      statusCode: 404,
      message: "Voucher not existed!",
      data: {},
    });
  }
  await voucher.delete();
  res.status(200).json({
    statusCode: 200,
    message: "Delete voucher successfully",
  });
};
