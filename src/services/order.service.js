import mongoose from "mongoose";
import moment from "moment";
import _ from "lodash";
import crypto from "crypto";

import Order from "../models/order.model";
import Product from "../models/product.model";
import Voucher from "../models/voucher.model";
import FlashSale from "../models/flashSale.model";
import productModel from "../models/product.model";
import QueryFeatures from "../ultils/queryFeatures";

export const createOrderService = async (req) => {
  const res = {
    statusCode: 201,
    message: "Created order success!",
    data: {},
  };
  const { items, address, voucher } = await req.body;
  const userId = await req.user.id;

  try {
    const newItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById({ _id: item.productId });

        const flashSalePopulated = await product.populate("flashSale");
        const flashSale = flashSalePopulated.flashSale;

        // console.log(typeof flashSale);
        //check timeEnd & quantity flashSale
        //check quantity product compare with quantity flashSale and quantity of order

        if (!!flashSale) {
          if (!(moment() < moment(flashSale.timeEnd))) {
            return {
              statusCode: 404,
              message: `Flash Sale out of date`,
            };
          }

          if (flashSale.quantity === 0) {
            if (!(product.quantity >= item.quantity)) {
              return {
                statusCode: 404,
                message: `Product \"${product.name}\" out of quantity`,
              };
            } else {
              let totalItemPrice = item.quantity * product.price * 1;

              return {
                productId: item.productId,
                quantity: item.quantity,
                totalItemPrice,
                name: product.name,
              };
            }
          }

          if (
            product.quantity < item.quantity &&
            flashSale.quantity < item.quantity
          ) {
            return {
              statusCode: 404,
              message: `Flash Sale or Product \"${product.name}\" quantity more than Order quantity`,
            };
          }

          let totalItemPrice =
            ((item.quantity *
              product.price *
              (100 - flashSale.discountPercent * 1)) /
              100) *
            1;

          await FlashSale.findByIdAndUpdate(
            product.flashSale,
            {
              quantity: flashSale.quantity - item.quantity,
            },
            { new: true }
          );

          return {
            productId: item.productId,
            quantity: item.quantity,
            totalItemPrice,
            name: product.name,
          };
        } else if (!flashSale) {
          if (!(product.quantity >= item.quantity)) {
            return {
              statusCode: 404,
              message: `Product \"${product.name}\" out of quantity`,
            };
          }
          const totalItemPrice = item.quantity * product.price * 1;

          return {
            productId: item.productId,
            quantity: item.quantity,
            totalItemPrice,
            name: product.name,
          };
        }
      })
    );

    if (!!newItems) {
      const voucherOrder = await Voucher.findById({ _id: voucher });

      const totalQuantity = newItems.reduce((total, amout) => {
        return total + amout.quantity;
      }, 0);
      const totalCostOrder = newItems.reduce((total, amout) => {
        return total + amout.totalItemPrice;
      }, -voucherOrder.discount * 1);
      // console.log(totalQuantity);
      // console.log(totalCostOrder);
      // minus product & flashSale when order create
      // await product.updateOne({ quantity: product.quantity - item.quantity });
      // minus product & flashSale when order create
      // await product.updateOne({
      //   quantity: product.quantity - item.quantity,
      // });

      const token = crypto.randomBytes(10).toString("hex");
      const orderName = `ORDER-${token}`;

      const orderRequired = {
        _id: mongoose.Types.ObjectId(),
        name: orderName,
        user: userId,
        items: newItems,
        address,
        voucher,
        totalQuantity,
        totalCostOrder,
      };
      const newOrder = await Order.create(orderRequired);
      res.data = newOrder;
    }
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const getAllOrderService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Get all order success!",
    data: {},
  };

  try {
    const features = new QueryFeatures(Order.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .pagination();

    //Execute query
    const order = await features.query;
    res.data = order;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const getOneOrderService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Get order success!",
    data: {},
  };
  const { id } = req.params;

  try {
    const order = await Order.findById({ _id: id });
    if (!order) {
      return {
        statusCode: 404,
        message: "Order not existed!",
      };
    }
    res.data = order;
  } catch (err) {
    (res.statusCode = 500), (res.message = err.message);
  }
  return res;
};

export const updateOneOrderService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Updated order success!",
    data: {},
  };
  const { id } = await req.params;
  const { ...orderParams } = await req.body;

  try {
    const order = await Order.findById({ _id: id });

    if (!order) {
      return res.status(404).json({
        statusCode: 404,
        message: "Order not existed!",
        data: {},
      });
    }

    await order.updateOne(orderParams);
    res.data = orderParams;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const deleteOneOrderService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Deleted order success!",
  };
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return {
        statusCode: 404,
        message: "Order not existed!",
      };
    }

    await order.delete();
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};
