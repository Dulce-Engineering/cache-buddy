const CacheBase = require("./CacheBase");

class CacheRedis extends CacheBase
{
  async hasData(key)
  {
    return this.db.existsAsync(key);
  }

  async flush()
  {
    return this.db.flushdb();
  }

  async get(key)
  {
    let res;

    const data = await this.db.getAsync(key);
    if (data)
    {
      res = JSON.parse(data);
    }

    return res;
  }

  async set(key, data, execMillis, expiryMillis)
  {
    let res = true, json = null;

    if (data)
    {
      json = JSON.stringify(data);
    }
    await this.db.setAsync(key, json, "PX", expiryMillis);
    console.log("CacheRedis.set(): cache write to key ", key);

    return res;
  }
}

module.exports = CacheRedis;