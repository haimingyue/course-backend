const Redis = require("ioredis");

const redis = new Redis({
  port: 6379, // Redis port
  host: "49.234.9.51",
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: "xdclass.net",
});

const redisConfig = {
  set: (key, value, time) => {
    time ? redis.set(key, value, "EX", time) : redis.set(key, value);
  },
  get: (key) => {
    return redis.get(key);
  },
  del: (key) => {
    return redis.del(key);
  },
};

module.exports = redisConfig;
