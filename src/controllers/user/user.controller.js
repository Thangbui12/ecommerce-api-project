import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../../models/user.model";

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

  console.log(userExisted, emailExisted);

  if (!userExisted && !emailExisted) {
    // Bcrypt password
    const saltRounds = 10;
    const myPlaintextPassword = "s0//P4$$w0rD";
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(myPlaintextPassword, salt);
    // const someOtherPlaintextPassword = "not_bacon";
    // nest required value for create schema
    const userRequire = {
      _id: mongoose.Types.ObjectId(),
      username,
      password: hash,
      email,
      phone,
      created: Date.now(),
      isAdmin,
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

export const loginUser = async () => {};
