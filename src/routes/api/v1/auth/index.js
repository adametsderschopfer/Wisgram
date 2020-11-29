const router = require('express').Router();

// validation
const {
  validateRegistrationBody,
  validateLoginBody,
  emailValidator,
  repeatPasswordValidator,
} = require('../../../../middlewares/validateBody.middleware');

// controllers
const registerController = require('../../../../controllers/auth/register.controller');
const loginController = require('../../../../controllers/auth/login.controller');
const {
  checkUserExist,
  resetPassword,
} = require('../../../../controllers/auth/resetPassword.controller');
const autoLoginController = require('../../../../controllers/auth/autoLogin.controller');

router.post('/register', validateRegistrationBody(), registerController);

router.post('/login', validateLoginBody(), loginController);

router.post('/autoLogin', autoLoginController);

router.post('/logout', (req, res) => {
  res.cookie('refreshToken', null);
  res.cookie('accessToken', null);

  res.json({ isLogout: true });
});

router.post('/resetpassword/checkuserexist', [emailValidator], checkUserExist);

router.post('/resetpassword', [repeatPasswordValidator], resetPassword);

module.exports = router;
