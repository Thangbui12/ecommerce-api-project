import {
  createVoucherService,
  deleteOneVoucherService,
  getAllVoucherService,
  getOneVoucherService,
  updateOneVoucherService,
} from "../../services/voucher.service";

export const createVoucher = async (req, res) => {
  const { statusCode, message, data } = await createVoucherService(req);
  return res.status(statusCode).json({ message, data });
};

//getAllVoucher
export const getAllVoucher = async (req, res) => {
  const { statusCode, message, data } = await getAllVoucherService(req);
  return res.status(statusCode).json({ message, data });
};

export const getOneVoucher = async (req, res) => {
  const { statusCode, message, data } = await getOneVoucherService(req);
  return res.status(statusCode).json({ message, data });
};

export const updateOneVoucher = async (req, res) => {
  const { statusCode, message, data } = await updateOneVoucherService(req);
  return res.status(statusCode).json({ message, data });
};

export const deleteOneVoucher = async (req, res) => {
  const { statusCode, message } = await deleteOneVoucherService(req);
  return res.status(statusCode).json({ message });
};
