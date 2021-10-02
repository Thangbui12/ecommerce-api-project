import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const accessToken = req.header("jwt");
    // console.log(token);
    // const accessToken = token.split(" ")[1];
    console.log(accessToken);
    // console.log(typeof accessToken);
    if (!accessToken) {
      return res.status(401).json({
        message: "Access denied",
      });
    }
    // console.log(procee.env.JWT_EXPIRES_IN);
    const user = jwt.verify(accessToken, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    req.user = user;
    next();
  } catch (err) {
    return res.status(404).json({
      statusCode: 404,
      message: `${err.message} Error!`,
      data: {},
    });
  }
};
export default verifyToken;
