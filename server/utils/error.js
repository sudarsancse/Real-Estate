export const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

// export const successHandler = (statusCode, message) => {
//   return {
//     statusCode: statusCode,
//     success: true,
//     message: message,
//   };
// };

export const successHandler = (statusCode, message) => {
  const Sucess = new Error();
  Sucess.statusCode = statusCode;
  Sucess.message = message;
  return Sucess;
};
