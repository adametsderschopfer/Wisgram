const { body } = require('express-validator');

function isEqualsPasswords(value, { req }) {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password.');
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
  .isLength({ min: 8, max: 60 })
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
  .custom(isEqualsPasswords);

function validateRegistrationBody() {
  return [
    usernameValidator,
    body('email').trim().isEmail(),
    passwordValidator,
    repeatPasswordValidator,
    body('rulesAccepted').isBoolean().toBoolean().custom(isTrue),
  ];
}

function validateLoginBody() {
  return [usernameValidator, passwordValidator];
}

module.exports = {
  validateRegistrationBody,
  validateLoginBody,
  isEqualsPasswords,
};
