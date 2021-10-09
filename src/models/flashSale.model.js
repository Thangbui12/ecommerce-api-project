import mongoose from "mongoose";

const flashSaleSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  productId: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
  discountPercent: {
    type: Number,
    required: true,
  },
  timeStart: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  timeEnd: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("FlashSale", flashSaleSchema);
