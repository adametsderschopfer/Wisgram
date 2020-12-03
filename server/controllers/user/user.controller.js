/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const User = require('../../models/User.model');
const { query } = require('../../utils/database');
const { senderMail } = require('../../utils');
const Cache = require('../../services/Cache.service');

class UserController {
  static profile(req, res) {
    const errMessage = 'Возникла ошибка при получение профиля пользователя';
    const { userId } = req.params;

    const sql = `SELECT 
      userId,
      username,
      email,
      bio,
      location,
      company,
      website,
      facebook,
      instagram,
      twitter,
      github FROM users WHERE userId = ?`;

    return query(sql, [userId])
      .then(result => {
        if (!result || !result?.length) {
          throw Error(errMessage);
        }

        res.json({
          success: true,
          profile: { ...result[0] },
        });

        Cache.set(userId, JSON.stringify(result[0]), 3600);
      })
      .catch(err => {
        if (err) {
          res.status(403).json({ msg: errMessage });
        }
      });
  }

  static getOwnUsers(req, res) {
    const { userId } = req.user;

    User.findOne({ userId })
      .then(result => {
        if (result) {
          if (result.friends?.length) {
            Cache.set(`ownUsers${userId}`, JSON.stringify(result.friends), 900);
          }

          res.json({ friends: result.friends || [] });
        } else {
          res.json({ friends: [] });
        }
      })
      .catch(err => {
        if (err) {
          console.error(err);
          res.status(503);
        }
      });
  }

  static editUser(req, res) {
    const {
      username,
      email,
      bio = null,
      location = null,
      company = null,
      website = null,
      facebook = null,
      instagram = null,
      twitter = null,
      github = null,
    } = req.body;

    if (!username && !email) {
      return res
        .status(401)
        .json({ msg: 'Поля Username и Email не должны быть пустыми!' });
    }

    const sql = `UPDATE users SET username=?,
    email=?,
    bio=?,
    location=?,
    company=?,
    website=?,
    facebook=?,
    instagram=?,
    twitter=?,
    github WHERE userId=?`;

    return query(sql, [
      username,
      email,
      bio,
      location,
      company,
      website,
      facebook,
      instagram,
      twitter,
      github,
      req.user.userId,
    ])
      .then(() => {
        res.status(204).json({
          msg: 'Профиль успешно обновлен!',
        });
      })
      .catch(err => {
        res.status(400).json({
          msg:
            'Что-то пошло не так при попытке редактирования профиля пожалуйста проверьте заполненные поля и повторите вновь!',
        });

        console.err(err);
      });
  }

  static searchUser(req, res) {
    const errMsg = 'По данному запросу ничего не было найденно.';
    const { q } = req.query;

    if (!q || q === null || q === undefined || !q?.length) {
      return res.status(204);
    }

    const sql = `SELECT userId,
    username,
    email,
    bio,
    location,
    company,
    website,
    facebook,
    instagram,
    twitter,
    github FROM users WHERE username LIKE ?`;

    return query(sql, [`%${q.toString()}%`])
      .then(data => {
        if (!data?.length) {
          return res.status(400).json({ msg: errMsg });
        }

        res.json({
          success: true,
          result: data,
        });

        Cache.set(q, JSON.stringify(data), 600);
      })
      .catch(err => {
        if (err) {
          res.status(400).json({ msg: errMsg });

          throw err;
        }
      });
  }

  static removeUser(req, res) {}

  static deleteAccount(req, res) {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401);
    }

    const sql = 'DELETE FROM users WHERE userId = ?';

    query(sql, [userId])
      .then(async info => {
        await User.findByIdAndDelete(userId);

        res.cookie('refreshToken', null);
        res.cookie('accessToken', null);

        res.json({ msg: 'Аккаунт успешно удален. Прощайте!' });
      })
      .catch(err => {
        if (err) {
          res
            .status(401)
            .json({ msg: 'Что то пошло не так при удаление аккаунта.' });
          throw err;
        }
      });

    /*
      TODO: REMOVE DATA ABOUT ACCOUNT FROM MONGODB WHEN TO SETTING IT (mongo)
    */
  }

  static addUser(req, res) {}

  static resetPassword(req, res) {}
}

module.exports = UserController;
