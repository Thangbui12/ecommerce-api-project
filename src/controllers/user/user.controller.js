import {
  createUserService,
  deleteOneUserService,
  forgotPasswordService,
  getAllUsersService,
  getOneUserService,
  loginUserService,
  resetPasswordService,
  uploadAvatarUserService,
} from "../../services/user.service";

//Authentication

export const createUser = async (req, res) => {
  const { statusCode, message, data } = await createUserService(req);
  return res.status(statusCode).json({ message, data });
};

//login
export const loginUser = async (req, res) => {
  const { statusCode, message, data } = await loginUserService(req);
  return res.status(statusCode).json({ message, data });
};

// Forgot Authentication

export const forgotPassword = async (req, res) => {
  const { statusCode, message, data } = await forgotPasswordService(req);
  return res.status(statusCode).json({ message, data });
};

// ResetPassword

export const resetPassword = async (req, res) => {
  const { statusCode, message, data } = await resetPasswordService(req);
  return res.status(statusCode).json({ message, data });
};

// User

export const getAllUsers = async (req, res) => {
  const { statusCode, message, data } = await getAllUsersService(req);
  return res.status(statusCode).json({ message, data });
};

export const getOneUser = async (req, res) => {
  const { statusCode, message, data } = await getOneUserService(req);
  return res.status(statusCode).json({ message, data });
};

export const deleteOneUser = async (req, res) => {
  const { statusCode, message, data } = await deleteOneUserService(req, res);
  res.cookie("jwt", "");
  return res.status(statusCode).json({ message, data });
};

// Upload Avatar
export const uploadAvatarUser = async (req, res) => {
  const { statusCode, message, data } = await uploadAvatarUserService(req);
  return res.status(statusCode).json({ message, data });
};
