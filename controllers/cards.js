const card = require('../models/card');
const Card = require('../models/card');
const user = require('../models/user');
const { handleError, create404 } = require('../utils/handleError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => handleError(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => { res.send({ data: card }); })
    .catch((err) => handleError(err, res));
};

module.exports.deleteCard = (req, res) => {
  if(req.user._id !== card.owner) {
  Card.findOneAndRemove({ _id: req.params.cardId })
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return null;
      }
      return create404(`Карточка с идентификатором ${req.params.cardId} не найдена`);
    })
    .catch((err) => handleError(err, res));
  } else {
    return res.status(403).send({message: 'Не достаточно прав'})
  }
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    if (card) {
      res.send({ data: card });
      return null;
    }
    return create404(`Карточка с идентификатором ${req.params.cardId} не найдена`);
  })
    .catch((err) => handleError(err, res));
};

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((card) => {
  if (card) {
    res.send({ data: card });
    return null;
  }
  return create404(`Карточка с идентификатором ${req.params.cardId} не найдена`);
})
  .catch((err) => handleError(err, res));
