const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const { query } = require('../../utils/database');

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

  const secret = config.get('JWTSecret');
  const token = jwt.sign({ userId: _user.userId, email: _user.email }, secret, {
    expiresIn: '30d',
  });

  res.cookie('token', token);

  delete _user.password;
  res.json({ user: _user });
};
