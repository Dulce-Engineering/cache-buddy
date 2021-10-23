import Client_Cache from "./Client_Cache.js";

class Client_Cache_Mem extends Client_Cache
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

  delete(key)
  {
    const entries = this.entries;
    delete entries[key];
    return true;
  }
}

export default Client_Cache_Mem;
