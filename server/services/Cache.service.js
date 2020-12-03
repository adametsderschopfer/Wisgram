const config = require('config');
const redis = require('redis');

const redisClient = redis.createClient({ port: config.get('REDIS_PORT') });

class Cache {
  static profileCache(req, res, next) {
    const { userId } = req.params;

    redisClient.get(`profile#${userId}`, (err, data) => {
      if (err) throw err;

      if (data !== null) {
        res.json({
          success: true,
          profile: { ...JSON.parse(data) },
        });
      } else {
        next();
      }
    });
  }

  static searchCache(req, res, next) {
    const { q } = req.query;

    redisClient.get(q, (err, data) => {
      if (err) throw err;

      if (data !== null) {
        res.json({
          success: true,
          result: { ...JSON.parse(data) },
        });
      } else {
        next();
      }
    });
  }

  static getOwnUsersCache(req, res, next) {
    const { userId } = req.user;

    redisClient.get(`ownUsers${userId}`, (err, data) => {
      if (err) throw err;

      if (data !== null) {
        res.json({
          success: true,
          result: { ...JSON.parse(data) },
        });
      } else {
        next();
      }
    });
  }

  static get user() {
    return {
      profile: Cache.profileCache,
      search: Cache.searchCache,
      ownUsers: Cache.getOwnUsersCache,
    };
  }

  /**
   *
   * @param {string} key
   * @param {string} value
   * @param {number} seconds
   *
   * @returns {Promise<boolean>}
   */

  static async set(key, value, seconds) {
    return redisClient.setex(key, seconds, value);
  }
}

module.exports = Cache;

exports.redisClient = redisClient;
