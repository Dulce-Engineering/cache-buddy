import Client_Cache from "./Client_Cache.js";

class Client_Cache_Local extends Client_Cache
{
  constructor(config)
  {
    super(config);
  }

  async Use_Update(key, calc_fn, update_fn, expiry_millis)
  {
    let data = null;

    if (this.cacheOn)
    {
      const has_curr_data = await this.hasData(key);

      if (this.Has_Entry(key))
      {
        data = await this.get(key);
        update_fn(data, has_curr_data);
      }

      if (!has_curr_data || this.forceRefresh)
      {
        const startTime = Date.now();
        data = await calc_fn();
        const execMillis = Date.now() - startTime;

        update_fn(data, true);
        await this.delete(key);

        if (expiry_millis == null || expiry_millis == undefined)
        {
          expiry_millis = this.expiryMillis;
        }
        await this.set(key, data, execMillis, expiry_millis);
      }
    }
    else
    {
      data = await calc_fn();
      update_fn(data, true);
    }
  }

  // overrides ====================================================================================

  async hasData(key)
  {
    let res = false;
    const entry = this.Get(key);

    if (entry && entry.expireTimeMillis > Date.now())
    {
      res = true;
    }

    return res;
  }

  async get(key)
  {
    let res;

    const entry = this.Get(key);
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
    this.Set(key, entry);

    return true;
  }

  async delete(key)
  {
    localStorage.removeItem(key);

    return true;
  }
  
  // raw access ===================================================================================

  Has_Entry(key)
  {
    return localStorage.getItem(key) == null ? false : true;
  }

  Is_Expired(key)
  {
    let res = false;
    const entry = this.Get(key);

    if (entry && entry.expireTimeMillis > Date.now())
    {
      res = true;
    }

    return res;
  }

  Get(key)
  {
    let res = null;

    const entry_str = localStorage.getItem(key);
    if (entry_str)
    {
      res = JSON.parse(entry_str);
    }

    return res;
  }

  Set(key, data)
  {
    const entry_str = JSON.stringify(data)
    localStorage.setItem(key, entry_str);
  }
}

export default Client_Cache_Local;
