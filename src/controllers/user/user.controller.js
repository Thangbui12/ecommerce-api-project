import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import nodemailer from "nodemailer";
import crypto from "crypto";
import moment from "moment";

import User from "../../models/user.model";
import { signToken } from "../../ultils/signToken";
import { sendEmail } from "../../ultils/sendMail";

//Authentication

export const createUser = async (req, res) => {
  //get require value User
  const { username, password, email, phone, isAdmin } = await req.body;
  // console.log(username, email);
  // console.log(req.body);

  // Exist user or email handler
  const userExisted = await User.findOne({
    username,
  });
  const emailExisted = await User.findOne({
    email,
  });

  // console.log(userExisted, emailExisted);

  if (!userExisted && !emailExisted) {
    // Bcrypt password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    // nest required value for create schema
    const userRequire = {
      _id: mongoose.Types.ObjectId(),
      username,
      password: hash,
      email,
      phone,
      isAdmin,
      slug: slugify(username).toLocaleLowerCase(),
    };

    const newUser = await User.create(userRequire);

    res.status(201).json({
      status: "Created user success!",
      data: {
        user: newUser,
      },
    });
  } else {
    res.status(500).json({
      status: "Username or Email existed!",
    });
  }
};

export const loginUser = async (req, res) => {
  let username = req.body.username,
    password = req.body.password,
    email = req.body.email;
  console.log(username, password, email);

  const result = !!username ? { username: username } : { email: email };

  console.log(result);
  try {
    // Check Email or Username Or Password existed
    const user = await User.findOne({ result });
    console.log(user.password);
    // console.log(user);
    // If user or email existed
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "Username or Email incorrect!",
        data: {},
      });
    }

    // If user or email correct compare password
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(404).json({
        statusCode: 404,
        message: "Password incorrect!",
        data: {},
      });
    }

    // If okay all send token to client
    const token = signToken(user.id, user.email);
    res.cookie("jwt", token, { secure: true, httpOnly: true });

    res.status(200).json({
      statusCode: 200,
      message: "Login success!",
      data: {
        token: token,
      },
    });
  } catch (err) {
    res.status(404).json({
      statusCode: 404,
      message: err.message,
      data: {},
    });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "");
    res.status(200).json({
      statusCode: 200,
      message: "Logout success!",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      statusCode: 404,
      message: err.message,
      data: {},
    });
  }
};

// User

export const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json({
    statusCode: 200,
    message: "Get all users successfully",
    data: {
      users,
    },
  });
};

export const getOneUser = async (req, res) => {
  const username = req.params.slug;
  console.log(username);
  const user = await User.findOne({ username: username });
  // console.log(user);

  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      message: "User not existed!",
      data: {},
    });
  }

  res.status(200).json({
    statusCode: 200,
    message: "Get single User Success!",
    data: {
      user,
    },
  });
};

export const deleteOneUser = async (req, res) => {
  const username = req.params.slug;

  const user = await User.findOneAndRemove({ username: username });
  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      message: "User not existed!",
      data: {},
    });
  }

  res.cookie("jwt", "");

  res.status(200).json({
    statusCode: 200,
    message: "Delete User Success!",
  });
};

// Forgot Authentication

export const forgotPassword = async (req, res) => {
  try {
    const { email } = await req.body;

    //CHeck user Exist
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not existed!",
        data: {},
      });
    }

    //Create and put token to database
    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);

    const baseUrl = `${process.env.BASE_URL}:${process.env.PORT}/api/reset-password/`;
    const htmlTemplate = `
    -----------------------------RESET PASSWORD-----------------------------
    Please click here to reset your password:   ${baseUrl}${token}
    `;

    // Send Mail
    await sendEmail(email, "Reset Password", htmlTemplate);

    await user.updateOne({
      resetPasswordExpires: moment().add(10, "minutes").toDate(),
      resetPasswordToken: token,
    });
    // console.log(moment().add(5, "minutes").calendar());
    res.status(200).json({
      statusCode: 200,
      message: "ForgotPassword mail sent successfully!",
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: err.message,
      data: {},
    });
  }
};

// ResetPassword

export const resetPassword = async (req, res) => {
  const { token } = await req.params;
  // console.log(typeof token);

  const { newPassword, confirmPassword } = await req.body;

  //Check user existed?
  const user = await User.findOne({
    resetPassword: token,
    resetPasswordExpires: { $gte: moment().toDate() },
  });
  console.log(user);
  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      message: "User not existed. ",
      data: {},
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(404).json({
      statusCode: 404,
      message: "Confirm password does not match!",
      data: {},
    });
  }

  //hash newPassword
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(newPassword, salt);

  //update to database

  await user.updateOne({
    password: hash,
    changePasswordDate: moment().toDate(),
  });

  res.status(200).json({
    statusCode: 200,
    message: "Password changed",
    data: {
      user: user.username,
      password: hash,
      changed: moment().toDate(),
    },
  });
};
