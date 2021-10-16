const CacheBase = require("./Server_Cache");

class CacheMem extends CacheBase
{
  constructor(config)
  {
    super(config);
    this.entries = {};
  }

  async hasData(key)
  {
    let res = false;
    const entry = this.entries[key];

    if (entry && entry.expireTimeMillis > Date.now())
    {
      res = true;
    }

    return res;
  }

  async get(key)
  {
    let res;

    const entry = this.entries[key];
    if (entry)
    {
      res = entry.data;
    }

    return res;
  }

  async set(key, data, execMillis, expiryMillis)
  {
    const expireTimeMillis = Date.now() + expiryMillis;
    this.entries[key] = { data, expireTimeMillis, execMillis };

    return true;
  }
}

module.exports = CacheMem;
