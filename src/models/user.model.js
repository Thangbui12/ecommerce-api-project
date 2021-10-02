import moment from "moment";
import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    default: "",
    required: false,
    trim: true,
  },
  created: {
    type: Date,
    default: moment().toDate(),
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isVerify: {
    type: Boolean,
    required: true,
    default: false,
  },
  avatar: {
    type: String,
    required: false,
    default: "default_avatar.jpg",
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpires: {
    type: String,
    required: false,
  },
  changePasswordDate: {
    type: Date,
    required: false,
  },
  token: {
    type: String,
  },
  slug: {
    type: String,
    require: false,
  },
});

export default mongoose.model("User", userSchema);
