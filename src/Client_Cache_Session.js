import Client_Cache from "./Client_Cache.js";

class Client_Cache_Session extends Client_Cache
{
  constructor(config)
  {
    super(config);
  }

  SessionStorage_Get(key)
  {
    let res;

    const entry_str = sessionStorage.getItem(key);
    if (entry_str)
    {
      res = JSON.parse(entry_str);
    }

    return res;
  }

  async hasData(key)
  {
    let res = false;
    const entry = this.SessionStorage_Get(key);

    if (entry && entry.expireTimeMillis > Date.now())
    {
      res = true;
    }

    return res;
  }

  async get(key)
  {
    let res;

    const entry = this.SessionStorage_Get(key);
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
    sessionStorage.setItem(key, entry_str);

    return true;
  }
  
  async delete(key)
  {
    sessionStorage.removeItem(key);

    return true;
  }
}

export default Client_Cache_Session;
