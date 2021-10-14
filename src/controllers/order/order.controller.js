import mongoose from "mongoose";
import moment from "moment";
import _ from "lodash";

import Order from "../../models/order.model";
import Product from "../../models/product.model";
import Voucher from "../../models/voucher.model";
import FlashSale from "../../models/flashSale.model";
import productModel from "../../models/product.model";
import QueryFeatures from "../../ultils/queryFeatures";

//Create on order
export const createOrder = async (req, res) => {
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
            return res.status(404).json({
              statusCode: 404,
              name: `${product.name}`,
              message: `Flash Sale out of date`,
            });
          }

          if (flashSale.quantity === 0) {
            if (!(product.quantity >= item.quantity)) {
              return res.status(404).json({
                statusCode: 404,
                name: `${product.name}`,
                message: `Product out of quantity`,
              });
            } else {
              let totalItemPrice = await (item.quantity * product.price * 1);

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
            return res.status(404).json({
              statusCode: 404,
              name: `${product.name}`,
              message: `Flash Sale or Product quantity more than Order quantity`,
            });
          }

          let totalItemPrice =
            (await ((item.quantity *
              product.price *
              (100 - flashSale.discountPercent * 1)) /
              100)) * 1;

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
            return res.status(404).json({
              statusCode: 404,
              name: `${product.name}`,
              message: `Product out of quantity`,
            });
          }
          const totalItemPrice = await (item.quantity * product.price * 1);

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
      console.log(voucherOrder.discount);
      //totalQuantity && totalCostOrder
      // await _.remove(newItems, function (n) {
      //   return n === 0;
      // });
      // console.log(newItems);
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
      const orderCount = await Order.count();
      console.log(orderCount);
      const orderName = `ORDER-${orderCount + 1}`;

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
      res.status(201).json({
        statusCode: 201,
        message: "Created Order success!",
        data: {
          newOrder,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
    });
  }
};

// Get All Order
export const getAllOrder = async (req, res) => {
  try {
    const features = new QueryFeatures(Order.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .pagination();

    //Execute query
    const order = await features.query;
    res.status(200).json({
      statusCode: 200,
      totalOrders: order.length,
      message: "Get all orders successfully",
      data: {
        order,
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

export const getOneOrder = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById({ _id: id });
  if (!order) {
    return res.status(404).json({
      statusCode: 404,
      message: "Order not existed!",
      data: {},
    });
  }

  res.status(200).json({
    statusCode: 200,
    message: "Get order successfully",
    data: {
      order,
    },
  });
};

export const updateOneOrder = async (req, res) => {
  const { id } = await req.params;
  const { ...orderParams } = await req.body;

  const order = await Order.findById({ _id: id });

  if (!order) {
    return res.status(404).json({
      statusCode: 404,
      message: "Order not existed!",
      data: {},
    });
  }

  await order.updateOne(orderParams);
  res.status(200).json({
    statusCode: 200,
    message: "Updated product successfully",
    data: {
      updated: orderParams,
    },
  });
};

export const deleteOneOrder = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById({ _id: id });

  if (!order) {
    return res.status(404).json({
      statusCode: 404,
      message: "Order not existed!",
      data: {},
    });
  }

  await order.delete();
  res.status(200).json({
    statusCode: 200,
    message: "Delete order successfully",
  });
};
