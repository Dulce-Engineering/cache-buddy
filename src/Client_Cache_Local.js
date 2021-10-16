import Client_Cache from "./Client_Cache.js";

class Client_Cache_Local extends Client_Cache
{
  constructor(config)
  {
    super(config);
  }

  async hasData(key)
  {
    let res = false;

    for (let i = 0; i < localStorage.length; i++)
    {
      const storage_key = localStorage.key(i);
      if (storage_key == key)
      {
        res = true;
        break;
      }
    }

    return res;
  }

  async get(key)
  {
    let res;

    const entry_str = localStorage.getItem(key);
    if (entry_str)
    {
      const entry = JSON.parse(entry_str);
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
