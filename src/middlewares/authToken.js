import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const authorization = await req.headers["authorization"];
  const accessToken = authorization.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({
      message: "Access denied",
    });
  }

  try {
    // console.log(procee.env.JWT_EXPIRES_IN);
    const user = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.user = user;

    next();
  } catch (err) {
    return res.status(403).json({
      statusCode: 403,
      message: `${err.message} Error!`,
      data: {},
    });
  }
};
export default verifyToken;
