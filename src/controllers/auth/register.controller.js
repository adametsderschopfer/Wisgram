const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const uuid = require('uuid');
const connection = require('../../utils/database');
const { transportConfig } = require('../../utils/config');

async function registerController(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  connection.connect();

  const { username, password, email } = req.body;

  connection.query(
    'SELECT username FROM users WHERE email=?',
    [email],
    (err, result) => {
      if (err) {
        res.status(400).json({
          msg: 'Something went wrong.',
        });

        throw Error(err);
      }

      if (result.length) {
        res.status(400).json({ msg: 'Данный Email уже занят!' });
        connection.end();
        throw Error('Email уже занят.');
      }
    },
  );

  const hashedPassword = await bcryptjs.hash(password, 10);
  const id = uuid.v4();

  const transporter = nodemailer.createTransport(transportConfig);

  const message = {
    from: 'no-reply@wisgram.com',
    to: email,
    subject: 'Регистрация успешна!',
    text: `
    
    
    `,
    html: `
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
        <li>Email для восстоновления пароля: ${email}</li>
      </ul>
    </div>
  </section>
    `,
  };

  connection.query(
    'INSERT INTO users (id, username, password, email) VALUES(?,?,?,?)',
    [id, username, hashedPassword, email],
    err => {
      if (err) {
        res.status(400).json({
          msg: 'Something went wrong.',
        });

        throw Error(err);
      }
      res.json({ success: true });
    },
  );

  connection.end();

  await transporter.sendMail(message);

  transporter.close();
}

module.exports = registerController;
