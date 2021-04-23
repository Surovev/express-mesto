const router = require('express').Router();
const { getCards, getCardById, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/', getCards);
router.get('/:id', getCardById);
router.post('/', createCard);
router.delete('/', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
