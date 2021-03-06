import Client_Cache from "./Client_Cache.js";

class Client_Cache_Local extends Client_Cache
{
  constructor(config)
  {
    super(config);
  }

  LocalStorage_Get(key)
  {
    let res;

    const entry_str = localStorage.getItem(key);
    if (entry_str)
    {
      res = JSON.parse(entry_str);
    }

    return res;
  }

  async hasData(key)
  {
    let res = false;
    const entry = this.LocalStorage_Get(key);

    if (entry && entry.expireTimeMillis > Date.now())
    {
      res = true;
    }

    return res;
  }

  async get(key)
  {
    let res;

    const entry = this.LocalStorage_Get(key);
    if (entry)
    {
      res = entry.data;
    }

    return res;
  }

  async set(key, data, execMillis, expiryMillis)
  {
    const expireTimeMillis = Date.now() + expiryMillis;
    const entry = { data, expireTimeMillis, execMillis };
    const entry_str = JSON.stringify(entry)
    localStorage.setItem(key, entry_str);

    return true;
  }
  
  async delete(key)
  {
    localStorage.removeItem(key);

    return true;
  }
}

export default Client_Cache_Local;
