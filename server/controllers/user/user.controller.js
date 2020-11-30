const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { query } = require('../../utils/database');
const { senderMail } = require('../../utils');

class UserController {
  static async profile(req, res) {
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
      })
      .catch(err => {
        if (err) {
          res.status(403).json({ msg: errMessage });
        }
      });
  }

  static async getUsers(req, res) {
    
  }

  static async editUser(req, res) {}

  static async searchUser(req, res) {}

  static async removeUser(req, res) {}

  static async addUser(req, res) {}

  static async resetPassword(req, res) {}
}

module.exports = UserController;
