import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const orderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 0,
      },
      totalItemPrice: {
        type: Number,
        default: 0,
      },
      name: {
        type: String,
      },
    },
  ],
  voucher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voucher",
  },
  adress: {
    type: String,
    require: true,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  totalQuantity: {
    type: Number,
    default: 0,
    required: true,
  },
  totalCostOrder: {
    type: Number,
    default: 0,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Order", orderSchema);
