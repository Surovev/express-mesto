const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserInfo,
  // createUser,

} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.patch('/me', updateUserProfile);
router.get('/:userId', getUserById);
router.patch('/me/avatar', updateUserAvatar);
// router.post('/signup', createUser);

module.exports = router;
