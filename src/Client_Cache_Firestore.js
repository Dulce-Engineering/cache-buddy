import Client_Cache from "./Client_Cache.js";

class Client_Cache_Firestore extends Client_Cache
{
  constructor(config)
  {
    super(config);
  }
  
  open(app)
  {
    this.db = app.firestore();
  }

  async Firestore_Set(key, value)
  {
    const table = this.db.collection("cache");
    await table.doc(key).set(value);
  }

  async Firestore_Get(key)
  {
    let entry;

    const table = this.db.collection("cache");
    const query = table.doc(key);
    const query_res = await query.get();
    if (query_res.exists)
    {
      entry = query_res.data();
    }

    return entry;
  }

  async hasData(key)
  {
    let res = false;
    const entry = await this.Firestore_Get(key);

    if (entry && entry.expireTimeMillis > Date.now())
    {
      res = true;
    }

    return res;
  }

  async get(key)
  {
    let res;

    const entry = await this.Firestore_Get(key);
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
    await this.Firestore_Set(key, entry);

    return true;
  }
}

export default Client_Cache_Firestore;
