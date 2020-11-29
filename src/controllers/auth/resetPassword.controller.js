const config = require('config');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { query } = require('../../utils/database');
const { generateCode, shortedEmail } = require('../../utils');
const { senderMail } = require('../../utils');

function checkUserExist(req, res) {
  const msg = 'Пользователь с таким email не найден!';
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

        try {
          await query('UPDATE users SET resetCode=? WHERE email=?', [
            code,
            email,
          ]);
        } catch (error) {
          res
            .status(400)
            .json({ msg: 'Что то пошло не так повторите попытку позже.' });

          throw error;
        }

        res.json({
          msg: `Код был отправлен на почту ${shortedEmail(email)}`,
        });

        await senderMail(
          email,
          'Попытка восстаоновления пароля.',
          `Код для восстановления пароля: ${code}. Если вы ничего не отсылали просто проигнорируйте это письмо.`,
        );
      } else {
        res.json({ msg });
      }
    })
    .catch(() => {
      res.status(400).json({ msg });
    });
}

function resetPassword(req, res) {
  const msg = 'Ошибки при вводе кода! Код неверен или не действителен!';
  const { resetCodeU, email, password } = req.body;

  if (!resetCodeU || !email) {
    return res.status(400).json({
      msg,
    });
  }

  query('SELECT resetCode FROM users WHERE email=?', [email])
    .then(async ([{ resetCode }]) => {
      if (resetCode === resetCodeU) {
        const newHashedPassword = await bcrypt.hash(password, 10);

        const removeResetCode = () => {
          query('UPDATE users SET resetCode=? WHERE email=?', [null, email]);
        };

        query('UPDATE users SET password=? WHERE email=?', [
          newHashedPassword,
          email,
        ])
          .then(async () => {
            res.json({
              success: true,
              msg: 'Пароль успешно изменен!',
            });

            await senderMail(
              email,
              'Пароль успешно изменен.',
              `Пароль успешно изменен. Ваш новый пароль: ${password}`,
            );

            removeResetCode();
          })
          .catch(err => {
            res.status(400).json({
              msg:
                'Возникли проблеммы в ходе смены пароля, пожалуйста попробуйте позже.',
            });

            removeResetCode();
          });
      } else {
        throw msg;
      }
    })
    .catch(() =>
      res.status(400).json({
        msg,
      }),
    );
}

module.exports = {
  checkUserExist,
  resetPassword,
};
