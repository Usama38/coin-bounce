const { ValidationError } = require("joi");

const errorHandler = (error, req, res, next) => {
  //default error
  let status = 500;
  let data = {
    message: "Internal server error",
  };

  if (error instanceof ValidationError) {
    //error from joi
    status = 401;
    data.message = error.message;
    return res.status(status).json(data);
  }

  if (error.status) {
    //if error has any status code which we set in authController
    status = error.status;
  }

  if (error.message) {
    //if error.message has any message which we set in authController
    data.message = error.message;
  }

  return res.status(status).json(data);
};

module.exports = errorHandler;
