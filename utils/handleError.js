const ERROR_CODE = 400;
const SERVER_ERROR_CODE = 500;
const ERROR_NOT_FOUND = 404;

module.exports.handleError = (err, res) => {
  console.log(err.name);
  if (err.name === 'CastError') { res.status(ERROR_CODE).send({ message: err.message }); } else if (err.name === 'ValidationError') { res.status(ERROR_CODE).send({ message: err.message }); } else if (err.name === 'NotFound') { res.status(ERROR_NOT_FOUND).send({ message: err.message }); } else { res.status(SERVER_ERROR_CODE).send({ message: err.message }); }
};

module.exports.create404 = function (message) {
  const error = new Error(message);
  error.name = 'NotFound';
  return Promise.reject(error);
};
