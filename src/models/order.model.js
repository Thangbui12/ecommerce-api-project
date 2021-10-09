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
      price: {
        type: Number,
        default: 0,
      },
      name: {
        type: String,
      },
    },
  ],

  adress: {
    type: String,
    require: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  voucher: {
    type: String,
    required: false,
  },
  totalQuantity: {
    type: Number,
    default: 0,
    required: true,
  },
  totalCost: {
    type: Number,
    default: 0,
    required: true,
  },
});

export default mongoose.model("Order", orderSchema);
