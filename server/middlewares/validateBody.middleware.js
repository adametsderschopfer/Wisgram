const { body } = require('express-validator');

function isEqualsPasswords(value, { req }) {
  if (value !== req.body.password) {
    return false;
  }

  return true;
}

function isTrue(value) {
  if (value !== true) {
    throw new Error('Accepted rules does not true.');
  }

  return true;
}

const usernameValidator = body('username')
  .not()
  .isEmpty()
  .isLength({ min: 6, max: 60 })
  .trim()
  .not()
  .matches(' ')
  .withMessage('Must contain a space.');

const passwordValidator = body('password')
  .not()
  .isEmpty()
  .isLength({ min: 5, max: 60 });

const repeatPasswordValidator = body('repeatPassword')
  .not()
  .isEmpty()
  .custom(isEqualsPasswords)
  .withMessage('Password is not equal repeat password');

const emailValidator = body('email').not().isEmpty().trim().isEmail();

function validateRegistrationBody() {
  return [
    usernameValidator,
    emailValidator,
    passwordValidator,
    repeatPasswordValidator,
    body('rulesAccepted').isBoolean().toBoolean().custom(isTrue),
  ];
}

function validateLoginBody() {
  return [emailValidator, passwordValidator];
}

module.exports = {
  validateRegistrationBody,
  validateLoginBody,
  isEqualsPasswords,
  emailValidator,
  repeatPasswordValidator,
  passwordValidator,
};
