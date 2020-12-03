const router = require('express').Router();

const verifyAuth = require('../../../../middlewares/auth.middleware');
const Cache = require('../../../../services/Cache.service');

const {
  profile,
  editUser,
  getOwnUsers,
  searchUser,
  acceptRequestUser,
  rejectRequestUser,
  resetPassword,
  deleteAccount,
  addtofriends,
  removefromfriends,
} = require('../../../../controllers/user/user.controller');

const {
  repeatPasswordValidator,
  passwordValidator,
} = require('../../../../middlewares/validateBody.middleware');

router.get('/profile/:userId', verifyAuth, Cache.user.profile, profile);

router.get('/search', verifyAuth, Cache.user.search, searchUser);

router.post(
  '/resetpassword',
  verifyAuth,
  [passwordValidator, repeatPasswordValidator],
  resetPassword,
);

router.post('/acceptrequest', verifyAuth, acceptRequestUser);

router.post('/rejectrequest', verifyAuth, rejectRequestUser);

router.post('/addtofriends', verifyAuth, rejectRequestUser);

router.post('/removefromfriends', verifyAuth, rejectRequestUser);

router.get('/users', verifyAuth, Cache.user.ownUsers, getOwnUsers);

router.post('/edituser', verifyAuth, editUser);

router.post('/deleteaccount', verifyAuth, deleteAccount);

module.exports = router;
