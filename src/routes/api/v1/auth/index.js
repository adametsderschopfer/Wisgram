const router = require('express').Router();
// path to root
const p2r = '../../../../';

// validation
const {
  validateRegistrationBody,
  validateLoginBody,
} = require(`${p2r}middlewares/validateBody.middleware`);

// controllers
const registerController = require(`${p2r}controllers/auth/register.controller`);
const loginController = require(`${p2r}controllers/auth/login.controller`);
const resetPasswordController = require(`${p2r}controllers/auth/resetPassword.controller`);
const autoLoginController = require(`${p2r}controllers/auth/autoLogin.controller`);

router.post('/register', validateRegistrationBody(), registerController);

router.post('/register', registerController);

router.post('/login', loginController);

router.post('/resetPassword', resetPasswordController);

module.exports = router;
