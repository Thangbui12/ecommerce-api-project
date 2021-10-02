import jwt from "jsonwebtoken";

export const signToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
