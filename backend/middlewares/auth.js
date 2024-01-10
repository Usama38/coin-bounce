const JWTService = require("../services/JWTService");
const User = require("../models/user");
const userDTO = require("../dto/user");

const auth = async (req, res, next) => {
  try {
    //1. access, refresh token validation
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken || !refreshToken) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }

    let _id;
    try {
      _id = JWTService.verifyAccessToken(accessToken)._id;
    } catch (error) {
      return next(error);
    }

    let user;
    try {
      user = await User.findOne({ _id: _id });
    } catch (error) {
      return next(error);
    }

    const userDto = new userDTO(user);

    req.user = userDto; //here addition of userDto type user

    next(); //call to next layer
  } catch (error) {
    return next(error);
  }
};
module.exports = auth;
