import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  slug: {
    type: String,
    required: false,
  },
  barcode: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: false,
    default: "default-image-product.jpg",
  },
  quantity: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    required: false,
    default: "LocalBrand",
  },
  description: {
    type: String,
    required: true,
  },
});

// productSchema.pre("save", function (next) {
//   if (err) return next(err);
//   filename = `user-${req.user.id}-${moment().format()}.jpeg`;

//   await fs.mkdirSync(`src/public/img/products/${req.user.id}`);

//   await sharp(req.file.buffer)
//     // .resize(500, 500)
//     .toFormat("jpeg")
//     .jpeg({ quality: 90 })
//     .toFile(`src/public/img/products/${req.user.id}/${req.file.filename}`);
//   next();
// });

export default mongoose.model("Product", productSchema);
