const router = require('express').Router();

const verifyAuth = require('../../../../middlewares/auth.middleware');
const Cache = require('../../../../services/Cache.service');

const {
  profile,
  editUser,
  getOwnUsers,
  searchUser,
  removeUser,
  addUser,
  resetPassword,
  deleteAccount,
} = require('../../../../controllers/user/user.controller');

const {
  repeatPasswordValidator,
} = require('../../../../middlewares/validateBody.middleware');

router.get('/profile/:userId', verifyAuth, Cache.user.profile, profile);

router.get('/search', verifyAuth, Cache.user.search, searchUser);

router.post('/removeuser/:userid', verifyAuth, removeUser);

router.post(
  '/resetpassword',
  verifyAuth,
  [repeatPasswordValidator],
  resetPassword,
);

router.post('/adduser/:userid', verifyAuth, addUser);

router.get('/users', verifyAuth, Cache.user.ownUsers, getOwnUsers);

router.post('/edituser', verifyAuth, editUser);

router.post('/deleteaccount', verifyAuth, deleteAccount);

module.exports = router;
