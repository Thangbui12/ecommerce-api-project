import {
  createOrderService,
  getAllOrderService,
  getOneOrderService,
  updateOneOrderService,
  deleteOneOrderService,
} from "../../services/order.service";

//Create on order
export const createOrder = async (req, res) => {
  const { statusCode, message, data } = await createOrderService(req);
  return res.status(statusCode).json({ message, data });
};

// Get All Order
export const getAllOrder = async (req, res) => {
  const { statusCode, message, data } = await getAllOrderService(req);
  return res.status(statusCode).json({ message, data });
};

export const getOneOrder = async (req, res) => {
  const { statusCode, message, data } = await getOneOrderService(req);
  return res.status(statusCode).json({ message, data });
};

export const updateOneOrder = async (req, res) => {
  const { statusCode, message, data } = await updateOneOrderService(req);
  return res.status(statusCode).json({ message, data });
};

export const deleteOneOrder = async (req, res) => {
  const { statusCode, message, data } = await deleteOneOrderService(req);
  return res.status(statusCode).json({ message, data });
};
