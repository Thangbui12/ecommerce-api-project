export const checkAdminRole = async (req, res, next) => {
  // console.log(req.user);
  // console.log("isAdmin? ", req.user.isAdmin);
  if (req.user.isAdmin === false) {
    return res.status(404).json({
      statusCode: 404,
      message: "Access denied, You are not Administrator!",
      data: {},
    });
  }
  next();
};
