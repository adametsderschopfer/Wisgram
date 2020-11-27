const router = require('express').Router();
const registerController = require('../../../../controllers/auth/register.controller');
const loginController = require('../../../../controllers/auth/login.controller');
const resetPasswordController = require('../../../../controllers/auth/resetPassword.controller');

router.post('/register', registerController);

router.post('/login', loginController);

router.post('/resetPassword', resetPasswordController);

module.exports = router;
