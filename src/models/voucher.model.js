import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const voucherSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  code: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  timeStart: {
    type: Date,
    required: true,
    trim: true,
  },
  timeEnd: {
    type: Date,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Voucher", voucherSchema);
