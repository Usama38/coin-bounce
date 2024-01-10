const Joi = require("joi");

const User = require("../models/user");

const bcrypt = require("bcryptjs");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const UserDTO = require("../dto/user");

const JWTService = require("../services/JWTService");

const RefreshToken = require("../models/token");

const authController = {
  async register(req, res, next) {
    //1. validate user input
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = userRegisterSchema.validate(req.body);

    //2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    //3. if username or password is already registered -> return an error
    const { username, name, email, password } = req.body;

    //check from databas
    try {
      const emailInuse = await User.exists({ email });

      const usernameInUse = await User.exists({ username });

      if (emailInuse) {
        const error = {
          statue: 409,
          message: "Email already registered, use another email",
        };
        return next(error); //calling middleware
      }
      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username not available. choose another username!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //4. password hash  ->convert userinput password into inversible hashed string value etc. 123abc=>sdhfdf42sdfsd54f65sd4f66f4sdf4
    const hashedPassword = await bcrypt.hash(password, 10);

    //5. store user data in db
    let accessToken;
    let refreshToken;
    let user;
    try {
      const userToRegister = new User({
        username,
        email,
        name,
        password: hashedPassword,
      });

      user = await userToRegister.save(); //store data in db here

      //token generation
      accessToken = JWTService.signAccessToken(
        {
          _id: user._id,
        },
        "30m"
      );

      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
      return next(error);
    }

    //store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, user._id);

    //send tokens in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    //6. response send
    const userDto = new UserDTO(user);

    return res.status(201).json({ user: userDto, auth: true });
  },
  async login(req, res, next) {
    //1. validate user input
    //2. if validate error, return error
    //3. match username and password
    //4. return response

    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { username, password } = req.body;
    let user;
    try {
      //match username
      user = await User.findOne({ username });
      if (!user) {
        //if user is null then true else false
        const error = {
          status: 401,
          message: "Invalid username",
        };
        return next(error);
      }

      //match password
      //req.body.password -> hash -> macth
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    let accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
    let refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    //update refresh token in db
    try {
      await RefreshToken.updateOne(
        { _id: user._id },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }
    //send tokens in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const userDto = new UserDTO(user);
    return res.status(200).json({ user: userDto, auth: true });
  },

  async logout(req, res, next) {
    // console.log(req);
    //1. delete refresh Token from db
    const { refreshToken } = req.cookies;
    try {
      await RefreshToken.deleteOne({ token: refreshToken }); //here refreshToken compare with existing one and delete which is same
    } catch (error) {
      return next(error);
    }

    //2. delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    //3. response
    res.status(200).json({ user: null, auth: false });
  },

  async refresh(req, res, next) {
    // 1.get refresh token form cookies
    const originalRefreshToken = req.cookies.refreshToken;

    // 2.verify refreshToken
    let id;
    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }

    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });
      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // 3.generate new tokens
    // 4.update db, return response
    try {
      const accessToken = JWTService.signAccessToken({ _id: id }, "30m");
      const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
    } catch (error) {
      return next(error);
    }

    const user = await User.findOne({ _id: id });

    const userDto = new UserDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
  },
};

module.exports = authController;
