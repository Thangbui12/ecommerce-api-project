import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const categorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    default: "category-banner.jpg",
  },
  position: {
    type: String,
    default: "100,100",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  slug: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Category", categorySchema);
