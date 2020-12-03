const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const uuid = require('uuid');
const { query } = require('../../utils/database');
const { senderMail } = require('../../utils');
const User = require('../../models/User.model');

async function registerController(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, email } = req.body;

  let isUserExist;

  try {
    isUserExist = await query('SELECT username FROM users WHERE email=?', [
      email,
    ]);
  } catch (error) {
    res.status(400).json({
      msg: 'Something went wrong.',
    });
  }

  if (isUserExist && isUserExist?.length) {
    res.status(400).json({ msg: 'Возможно данный email адресс уже занят!' });
    return false;
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  const userId = uuid.v4();

  try {
    await query(
      'INSERT INTO users (userId, username, password, email) VALUES(?,?,?,?)',
      [userId, username, hashedPassword, email],
    );

    await new User({
      userId,
      friends: [],
      status: false,
    }).save();

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({
      msg: 'Something went wrong.',
    });

    throw error;
  }

  await senderMail(
    email,
    'Регистрация успешна!',
    `Вы успешно зарегистрировались на ресурсе! Ваши учетные данные: Логин: ${username} Пароль: ${password} Email для восстановления пароля: ${email}`,
    `
    <section>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      }

      .h1 {
        color: #fff;
      }

      .centerBg {
        background-color: #34be5e;
        padding: 15px 0;
      }

      .container {
        max-width: 500px;
        width: 100%;
        margin: auto;
      }

      ul {
        margin-top: 10px;
        margin-left: 45px;
      }
    </style>

    <center class="centerBg">
      <h1 class="h1">Регистрация успешна</h1>
    </center>
    <hr />

    <div class="container">
      <h4>Вы успешно зарегистрировались на ресурсе</h4>
      <br />
      <p>Ваши учетные данные:</p>
      <ul>
        <li>Логин: ${username}</li>
        <li>Пароль: ${password}</li>
        <li>Email для восстановления пароля: ${email}</li>
      </ul>
    </div>
  </section>
    `,
  );

  return true;
}

module.exports = registerController;
