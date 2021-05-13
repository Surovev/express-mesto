const jwt = require('jsonwebtoken');
const LoginError = require('../errors/LoginError');

module.exports = (req, res, next) => {
  const token = req.cookies.userToken;
  try {
    if (!token) {
      throw new LoginError('Необходима авторизация');
    }
    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload; // записываем пейлоуд в объект запроса
    next(); // пропускаем запрос дальше
  } catch (err) {
    next(err);
  }
};
