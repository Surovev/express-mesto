const ERROR_CODE = 400;
const SERVER_ERROR_CODE = 500;
const ERROR_NOT_FOUND = 404;
const MONGOERROR = 409;
const JWT_ERROR = 401;

module.exports.handleError = (err, res, text) => {
  if (err.name === 'CastError') { res.status(ERROR_CODE).send({ message: err.message }); } else if (err.name === 'Error') { res.status(JWT_ERROR).send({ message: text }); } else if (err.name === 'MongoError') { res.status(MONGOERROR).send({ message: text }); } else if (err.name === 'ValidationError') { res.status(ERROR_CODE).send({ message: err.message }); } else if (err.name === 'NotFound') { res.status(ERROR_NOT_FOUND).send({ message: err.message }); } else { res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }); }
};

module.exports.create404 = (message) => {
  const error = new Error(message);
  error.name = 'NotFound';
  return Promise.reject(error);
};
