const User = require('../models/user');
const { handleError, create404 } = require('../utils/handleError');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => handleError(err, res));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => { if (user) { res.send({ data: user }); } else return create404(`Пользователь с идентификатором ${req.params.userId} не найден`); })
    .catch(err => handleError(err, res));
};

module.exports.createUser = (req, res) => {
  console.log(req.body);
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => handleError(err, res));
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true // данные будут валидированы перед изменением
    }
  )
    .then(user => { if (user) { res.send({ data: user }); } else return create404(`Пользователь с идентификатором ${req.params.id} не найден`); })
    .catch(err => handleError(err, res));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true // данные будут валидированы перед изменением
    }
  )
    .then(user => { if (user) { res.send({ data: user }); } else return create404(`Пользователь с идентификатором ${req.params.id} не найден`); })
    .catch(err => handleError(err, res));
};
