const Card = require('../models/card');
const { handleError, create404 } = require('../utils/handleError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => handleError(err, res));
};

module.exports.getCardById = (req, res) => {
  Card.findById(req.params.id)
    .then(card => { if (card) { res.send({ data: card }); } else return create404(`Карточка с идентификатором ${req.params.id} не найдена`); })
    .catch(err => handleError(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then(card => { res.send({ data: card }); })
    .catch(err => handleError(err, res));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.body;
  Card.findOneAndRemove(cardId)
    .then(card => { if (card) { res.send({ data: card }); } else return create404(`Карточка с идентификатором ${req.params.id} не найдена`); })
    .catch(err => handleError(err, res));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  ).then(card => { res.send({ data: card }); })
    .catch(err => handleError(err, res));
};

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true }
).then(card => { res.send({ data: card }); })
  .catch(err => res.status(500).send({ message: err.message }));
