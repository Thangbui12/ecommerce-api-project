import {
  createFlashSaleService,
  getAllFlashSaleService,
  getOneFlashSaleService,
  updateOneFlashSaleService,
  deleteOneFlashSaleService,
} from "../../services/flashSale.service";

export const createFlashSale = async (req, res) => {
  const { statusCode, message, data } = await createFlashSaleService(req);
  return res.status(statusCode).json({ message, data });
};

export const getAllFlashSale = async (req, res) => {
  const { statusCode, message, data } = await getAllFlashSaleService(req);
  return res.status(statusCode).json({ message, data });
};

export const getOneFlashSale = async (req, res) => {
  const { statusCode, message, data } = await getOneFlashSaleService(req);
  return res.status(statusCode).json({ message, data });
};

export const updateOneFlashSale = async (req, res) => {
  const { statusCode, message, data } = await updateOneFlashSaleService(req);
  return res.status(statusCode).json({ message, data });
};

//Delete One Flash Sale
export const deleteOneFlashSale = async (req, res) => {
  const { statusCode, message, data } = await deleteOneFlashSaleService(req);
  return res.status(statusCode).json({ message, data });
};
