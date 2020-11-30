const router = require('express').Router();

const verifyAuth = require('../../../../middlewares/auth.middleware');

const {
  profile,
  editUser,
  getUsers,
  searchUser,
  removeUser,
  addUser,
  resetPassword,
} = require('../../../../controllers/user/user.controller');

const {
  repeatPasswordValidator,
} = require('../../../../middlewares/validateBody.middleware');

router.get('/profile/:userId', verifyAuth, profile);

router.get('/search/:username', verifyAuth, searchUser);

router.post('/removeuser/:userid', verifyAuth, removeUser);

router.post(
  '/resetpassword',
  verifyAuth,
  [repeatPasswordValidator],
  resetPassword,
);

router.post('/adduser/:userid', verifyAuth, addUser);

router.get('/users', verifyAuth, getUsers);

router.post('/edituser', verifyAuth, editUser);

module.exports = router;
