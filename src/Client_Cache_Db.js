import Client_Cache from "./Client_Cache.js";

class Client_Cache_Db extends Client_Cache
{
  constructor(config)
  {
    super(config);
  }

  async open()
  {
    this.db = await this.IndexedDb_Open();
  }

  IndexedDb_Open()
  {
    const res = new Promise(Exec);
    function Exec(resolve_fn, reject_fn)
    {
      const db_req = indexedDB.open("Client_Cache_Db");
      db_req.onerror = (event) => reject_fn();
      db_req.onsuccess = (event) => resolve_fn(event.target.result);
      db_req.onupgradeneeded = On_Upgrade_Needed;
      function On_Upgrade_Needed(event)
      {
        //console.log("Client_Cache_Db.On_Upgrade_Needed()");
        const db = event.target.result;
        db.createObjectStore("cache");
      }
    }

    return res;
  }

  IndexedDb_Delete(key)
  {
    const trans = this.db.transaction("cache", "readwrite");
    const table = trans.objectStore("cache");

    const res = new Promise(Exec);
    function Exec(resolve_fn, reject_fn)
    {
      const db_req = table.delete(key);
      db_req.onerror = () => reject_fn();
      db_req.onsuccess = () => resolve_fn(true);
    }

    return res;
  }

  IndexedDb_Set(key, value)
  {
    const trans = this.db.transaction("cache", "readwrite");
    const table = trans.objectStore("cache");

    const res = new Promise(Exec);
    function Exec(resolve_fn, reject_fn)
    {
      const db_req = table.put(value, key);
      db_req.onerror = () => reject_fn();
      db_req.onsuccess = (event) => resolve_fn(event.target.result);
    }

    return res;
  }

  IndexedDb_Get(key)
  {
    const trans = this.db.transaction("cache", "readonly");
    const table = trans.objectStore("cache");

    const res = new Promise(Exec);
    function Exec(resolve_fn, reject_fn)
    {
      const db_req = table.get(key);
      db_req.onerror = () => reject_fn();
      db_req.onsuccess = (event) => resolve_fn(event.target.result);
    }

    return res;
  }

  IndexDb_Error(event, reject_fn)
  {
    console.log("Client_Cache_Db.IndexDb_Error()");
    reject_fn();
  }

  async hasData(key)
  {
    let res = false;
    const entry = await this.IndexedDb_Get(key);

    if (entry && entry.expireTimeMillis > Date.now())
    {
      res = true;
    }

    return res;
  }

  async get(key)
  {
    let res;

    const entry = await this.IndexedDb_Get(key);
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
    await this.IndexedDb_Set(key, entry);

    return true;
  }

  delete(key)
  {
    return this.IndexedDb_Delete(key);
  }
}

export default Client_Cache_Db;
