const config = require('config');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { query } = require('../../utils/database');
const { generateCode, shortedEmail } = require('../../utils');
const { transportConfig } = require('../../utils/config');

function checkUserExist(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // eslint-disable-next-line no-underscore-dangle
  const _email = req.body.email;

  return query('SELECT email FROM users WHERE email=?', [_email])
    .then(async ([{ email }]) => {
      if (email) {
        const code = generateCode();
        const transporter = nodemailer.createTransport(transportConfig);
        const message = {
          from: 'no-reply@wisgram.com',
          to: email,
          subject: 'Попытка восстоновления пароля.',
          text: `Код для восстановления пароля: ${code}. Если вы ничего не отсылали просто проигнорируйте это письмо.`,
        };

        try {
          await query('UPDATE Users SET resetCode=? WHERE email=?', [
            code,
            email,
          ]);

          await transporter.sendMail(message);
        } catch (error) {
          res.json({ msg: 'Что то пошло не так повторите попытку позже.' });

          throw error;
        }

        res.json({
          msg: `Код был отправлен на почту ${shortedEmail(email)}`,
        });
      } else {
        res.json({ msg: 'Пользователь с таким email не найден!' });
      }
    })
    .catch(() => {
      res.json({ msg: 'Пользователь с таким email не найден!' });
    });
}

function codeValidation(req, res) {}

function resetPassword(req, res) {}

};
