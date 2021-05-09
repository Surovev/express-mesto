const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { handleError, create404 } = require('../utils/handleError');

const SOLT_ROUNDS = 10;

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Не передан email или пароль' });
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильная почта или пароль'));
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            console.log('Сломалася');
            return Promise.reject(new Error('Неправильная почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key');
          res.cookie('userToken', token, {
            maxAge: 3600000 * 7 * 24,
            httpOnly: true,
            sameSite: true,
          })
            .send({ _id: user._id });
        })
        .catch((err) => handleError(err, res, 'Неправильная почта или пароль'));
    })
    .catch((err) => res.statis(401).send({ message: err.message }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => handleError(err, res));
};

module.exports.getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return null;
      }
      return create404(`Пользователь с идентификатором ${req.params.id} не найден`);
    })
    .catch((err) => handleError(err, res));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return null;
      }
      return create404(`Пользователь с идентификатором ${req.params.id} не найден`);
    })
    .catch((err) => handleError(err, res));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, SOLT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => handleError(err, res, 'Пользователь с таким email уже сужествует'));
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return null;
      }
      return create404(`Пользователь с идентификатором ${req.params.id} не найден`);
    })
    .catch((err) => handleError(err, res));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return null;
      }
      return create404(`Пользователь с идентификатором ${req.params.id} не найден`);
    })
    .catch((err) => handleError(err, res));
};
