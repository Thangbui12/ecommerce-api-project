import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: "",
    required: false,
  },
  created: {
    type: Date,
    default: Date.now(),
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
});

export default mongoose.model("User", userSchema);
