const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const nodemailer = require('nodemailer');
const { query } = require('../../utils/database');
const { transportConfig } = require('../../utils/config');

const jwtExpirySeconds = 900;

function generateAccessToken(data) {
  return jwt.sign(data, config.get('JWTSecret'), {
    expiresIn: jwtExpirySeconds,
  });
}

module.exports = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password, email } = req.body;
  let user;

  try {
    user = await query('SELECT * FROM users WHERE email=?', [email]);

    if (!user.length) {
      throw Error('user not exist');
    }
  } catch (error) {
    res.json({
      msg: 'Возникла ошибка при авторизации!',
    });

    throw error;
  }

  // eslint-disable-next-line no-underscore-dangle
  const _user = user[0];

  try {
    await bcrypt.compare(password, _user.password);
  } catch (error) {
    res.json({
      msg: 'Возникла ошибка при авторизации!',
    });

    throw error;
  }

  delete _user.password;

  const secret = config.get('JWTSecret');

  const accessToken = generateAccessToken({
    userId: _user.userId,
    email: _user.email,
  });
  const refreshToken = jwt.sign(
    { email: _user.email, userId: _user.userId },
    secret,
  );

  res.cookie('accessToken', accessToken);
  res.cookie('refreshToken', refreshToken);

  res.json({ _user });

  nodemailer.createTransport(transportConfig).sendMail({
    from: 'no-reply@wisgram.com',
    to: _user.email,
    subject: 'Выполнен вход в аккаунт.',
    text: `Был произведен вход в аккаунт в ${new Date().toISOString()}`,
  });
};
