import moment from "moment";
import multer from "multer";
import sharp from "sharp";

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

export const uploadUserPhoto = upload.single("avatar");

export const resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next;
  req.file.filename = `user-${req.user.id}-${moment().format()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`src/public/img/users/${req.file.filename}`);
  next();
};
