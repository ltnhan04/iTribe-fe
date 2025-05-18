const redis = require("../libs/redis");

class RedisHelper {
  static set = async (key, value, time) => {
    return await redis.set(key, value, "EX", time);
  };

  static get = async (key) => {
    return await redis.get(key);
  };

  static del = async (key) => {
    return await redis.del(key);
  };

  static incr = async (key) => {
    return await redis.incr(key);
  };
}

module.exports = RedisHelper;
