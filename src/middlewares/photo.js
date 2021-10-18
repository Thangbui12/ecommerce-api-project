import moment from "moment";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

// Mutler config
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "src/public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const extend = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${moment().toString()}.${extend}`);
//   },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(err.message, false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

//upload Avatar
export const uploadUserPhoto = upload.single("avatar");

export const resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next;

  req.file.filename = `user-${req.user.id}-${moment().format()}.jpeg`;

  //mkdir src/public/img/users/${req.user.id}
  if (!fs.existsSync("src/public/img/users"))
    fs.mkdirSync(`src/public/img/users`);
  if (!fs.existsSync(`src/public/img/users/${req.user.id}`))
    fs.mkdirSync(`src/public/img/users/${req.user.id}`);

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`src/public/img/users/${req.user.id}/${req.file.filename}`);
  next();
};

//upload Images product
export const uploadProductPhoto = upload.array("photos", 12);
// export const uploadProductPhoto = upload.single("photos");
export const resizeProductPhoto = async (req, res, next) => {
  const { id } = await req.params;
  if (!req.files) return next;
  if (!fs.existsSync("src/public/img/products"))
    fs.mkdirSync(`src/public/img/products`);

  if (!fs.existsSync(`src/public/img/products/${id}`))
    fs.mkdirSync(`src/public/img/products/${id}`);

  //files handle
  const imgFiles = req.files;
  await imgFiles.forEach((el, index) => {
    el.filename = `product-${id}-${moment().format()}-${index}.jpeg`;
    sharp(el.buffer)
      .resize(1000, 1000)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`src/public/img/products/${id}/${el.filename}`);
  });

  next();
};

//banner
export const uploadBanner = upload.single("banner");
export const resizeBanner = async (req, res, next) => {
  const { id } = await req.params;
  if (!req.file) return next;

  req.file.filename = `category-${id}-${moment().format()}.jpeg`;

  if (!fs.existsSync("src/public/img/categories"))
    fs.mkdirSync(`src/public/img/categories`);
  if (!fs.existsSync(`src/public/img/categories/${id}`))
    fs.mkdirSync(`src/public/img/categories/${id}`);

  await sharp(req.file.buffer)
    .resize(1000, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`src/public/img/categories/${id}/${req.file.filename}`);
  next();
};
