const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(401).send({ message: 'необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Нет доступа' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
