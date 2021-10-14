import mongoose from "mongoose";
import bcrypt from "bcrypt";
import slugify from "slugify";
import crypto from "crypto";
import moment from "moment";

import User from "../models/user.model";
import { signToken } from "../ultils/signToken";
import { sendEmail } from "../ultils/sendMail";
import QueryFeatures from "../ultils/queryFeatures";

//Authentication

export const createUserService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Created User success!",
    data: {},
  };
  const { username, password, email, phone, isAdmin } = await req.body;

  try {
    const userExisted = await User.findOne({
      username,
    });
    const emailExisted = await User.findOne({
      email,
    });
    if (!!userExisted && !!emailExisted) {
      return {
        statusCode: 404,
        message: "Username or Email existed!",
      };
    }

    // Bcrypt password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const userRequire = {
      _id: mongoose.Types.ObjectId(),
      username,
      password: hash,
      email,
      phone,
      isAdmin,
      slug: slugify(username, { lower: true }),
    };

    const newUser = await User.create(userRequire);

    res.data = newUser;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const loginUserService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Login success!",
    data: {},
  };
  let { username, password, email } = await req.body;
  const result = !!username ? { username: username } : { email: email };
  try {
    const user = await User.findOne(result);
    if (!user) {
      return {
        statusCode: 404,
        message: "Username or Email incorrect!",
      };
    }

    // If user or email correct compare password
    if (!bcrypt.compareSync(password, user.password)) {
      return {
        statusCode: 404,
        message: "Password incorrect!",
      };
    }

    // If okay all send token to client
    const token = signToken({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    res.data = token;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const forgotPasswordService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Forgot password's mail sent success!",
  };
  const { email } = await req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return {
        statusCode: 404,
        message: "User not existed!",
      };
    }

    //Create and put token to database
    const token = crypto.randomBytes(32).toString("hex");

    const baseUrl = `${process.env.BASE_URL}:${process.env.PORT}/api/reset-password/`;
    const htmlTemplate = `
    -----------------------------RESET PASSWORD-----------------------------
    Please click here to reset your password:   ${baseUrl}${token}
    `;

    // Send Mail
    sendEmail(email, "Reset Password", htmlTemplate);
    //http://localhost:5035/api/reset-password/6e2414c92a0f2c3d8198feef7d05d53c269ff512f8b1bec0c0cda072efe0662d

    await user.updateOne({
      resetPasswordExpires: moment().add(10, "minutes").toDate(),
      resetPasswordToken: token,
    });
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const resetPasswordService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Password was changed!",
    data: {},
  };

  const { token } = await req.params;
  const { newPassword, confirmPassword } = await req.body;

  try {
    const user = await User.findOne({
      resetPassword: token,
      resetPasswordExpires: { $gte: moment().toDate() },
    });
    if (!user) {
      return {
        statusCode: 404,
        message: "User not existed. ",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        statusCode: 404,
        message: "Confirm password does not match!",
      };
    }

    //hash newPassword
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(newPassword, salt);

    await user.updateOne({
      password: hash,
      changePasswordDate: moment().toDate(),
    });

    res.data = {
      user: user.username,
      password: hash,
      changed: moment().toDate(),
    };
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

//User

export const getAllUsersService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Get all users success!",
    data: {},
  };
  try {
    const features = new QueryFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitfields()
      .pagination();

    //EXECUTE QUERY
    //query.sort().select().skip().limit()
    const users = await features.query;
    res.data = users;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const getOneUserService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Get user success!",
    data: {},
  };

  const username = req.params.slug;
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return {
        statusCode: 404,
        message: "User not existed!",
      };
    }

    res.data = user;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const deleteOneUserService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Deleted user success!",
  };
  const username = req.params.slug;
  try {
    const user = await User.findOneAndRemove({ username: username });
    if (!user) {
      return {
        statusCode: 404,
        message: "User not existed!",
      };
    }
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};

export const uploadAvatarUserService = async (req) => {
  const res = {
    statusCode: 200,
    message: "Uploaded avatar success!",
    data: {},
  };
  const { id } = req.params;
  const imgFile = await req.file;

  try {
    if (!imgFile) {
      return {
        statusCode: 404,
        message: "File Error!",
      };
    }

    if (id !== req.user.id) {
      return {
        statusCode: 405,
        message: "Not Allow Method",
      };
    }
    const filename = await req.file.filename;

    const updateAvatarUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: filename },
      {
        new: true,
        runValidators: true,
      }
    );
    res.data = updateAvatarUser;
  } catch (err) {
    res.statusCode = 500;
    res.message = err.message;
  }

  return res;
};
