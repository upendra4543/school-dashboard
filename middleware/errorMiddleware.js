import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);
    // 🔥 Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  let message = err.message;
  let statusCode = err.statusCode || 500;

  // 🔥 Handle invalid ObjectId (CastError)
  if (err.name === "CastError") {
    message = "Invalid Student ID";
    statusCode = 400;
  }
////  Duplicate key error
if(err.code === 11000){
  const field = Object.keys(err.keyValue)[0];
  message = `${field} already exist`;
  statusCode = 400;
}
//Validation error (mongoose schema error)
if(err.name === "ValidationError"){
    const messages = Object.values(err.errors).map(val => val.message);
    message = messages.join(",");
    statusCode = 400
}
  res.status(statusCode).json({
    success: false,
    message
  });
};

export default errorHandler;