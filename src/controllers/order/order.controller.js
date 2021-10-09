import mongoose from "mongoose";

import Order from "../../models/order.model";
import Product from "../../models/product.model";
import productModel from "../../models/product.model";
import QueryFeatures from "../../ultils/queryFeatures";

//Create on order
export const createOrder = async (req, res) => {
  const { userId, items, address, voucher } = await req.body;

  //get product property
  //get name for each product
  const newItems = Promise.all(
    items.map(async (item) => {
      console.log(item.productId);
      const product = await Product.findById({ _id: item.productId });
      // console.log(product);

      const price = !!product.flashSalePrice
        ? product.flashSalePrice
        : product.price;
      console.log(price);
      console.log(product.name);
      return {
        productId: item.productId,
        quantity: item.quantity,
        price,
        name: product.name,
      };
    })
  );

  const orderRequired = {
    _id: mongoose.Types.ObjectId(),
    user: userId,
    items,
    address,
    voucher,
  };
};
