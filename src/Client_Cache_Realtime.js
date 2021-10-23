import Client_Cache from "./Client_Cache.js";

class Client_Cache_Realtime extends Client_Cache
{
  constructor(config)
  {
    super(config);
  }
  
  open(app)
  {
    this.db = app.database();
  }

  Realtime_Set(key, value)
  {
    return this.db.ref("cache/" + key).set(value);
  }

  Realtime_Delete(key)
  {
    return this.db.ref("cache/" + key).remove();
  }

  async Realtime_Get(key)
  {
    let entry;

    const query_res = await this.db.ref("cache/" + key).once('value');
    if (query_res)
    {
      entry = query_res.val();
    }

    return entry;
  }

  async hasData(key)
  {
    let res = false;
    const entry = await this.Realtime_Get(key);

    if (entry && entry.expireTimeMillis > Date.now())
    {
      res = true;
    }

    return res;
  }

  async get(key)
  {
    let res;

    const entry = await this.Realtime_Get(key);
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
    await this.Realtime_Set(key, entry);

    return true;
  }

  async delete(key)
  {
    await this.Realtime_Delete(key);
    return true;
  }
}

export default Client_Cache_Realtime;
