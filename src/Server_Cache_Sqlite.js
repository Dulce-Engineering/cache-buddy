const CacheBase = require("./Server_Cache");
const sqlite3 = require("sqlite3");

class CacheMem extends CacheBase
{
  constructor(config)
  {
    super(config);
    this.db = new sqlite3.Database(config.filename, config.model);
  }

  async open()
  {
    const sql = `
      create table cache
      (
        id integer primary key,
        key text,
        data text,
        expiry_time integer,
        exec_millis integer
      );
    `;
    await this.Sqlite_Exec(sql);
  }

  Sqlite_Exec(sql)
  {
    Executor = Executor.bind(this);

    const promise = new Promise(Executor);
    function Executor(resolve, reject)
    {
      this.db.exec(sql, On_Exec);
      function On_Exec(err)
      {
        if (err)
        {
          reject(err);
        }
        else
        {
          resolve(true);
        }
      }
    }

    return promise;
  }

  Sqlite_Run(sql, params)
  {
    Executor = Executor.bind(this);

    const promise = new Promise(Executor);
    function Executor(resolve, reject)
    {
      this.db.run(sql, params, On_Exec);
      function On_Exec(err)
      {
        if (err)
        {
          reject(err);
        }
        else
        {
          resolve(this.lastID);
        }
      }
    }

    return promise;
  }

  Sqlite_Get(sql, params)
  {
    Executor = Executor.bind(this);

    const promise = new Promise(Executor);
    function Executor(resolve, reject)
    {
      this.db.get(sql, params, On_Get);
      function On_Get(err, row)
      {
        if (err)
        {
          reject(err);
        }
        else
        {
          resolve(row);
        }
      }
    }

    return promise;
  }

  async hasData(key)
  {
    let now = Date.now();
    const sql = "select true from cache where key = ? and expiry_time > ?";
    const sqlValue = await this.Sqlite_Get(sql, [key, now]);
    return sqlValue && sqlValue.true == 1;
  }

  async get(key)
  {
    let res;

    const sql = "select data from cache where key = ?";
    const row = await this.Sqlite_Get(sql, [key]);
    if (row)
    {
      res = JSON.parse(row.data);
    }

    return res;
  }

  async set(key, data, execMillis, expiryMillis)
  {
    let res = false, json = null;

    let expiryTime = Date.now() + expiryMillis;
    if (data)
    {
      json = JSON.stringify(data);
    }

    const sql = "insert into cache (key, data, expiry_time, exec_millis) "+
      "values (?, ?, ?, ?)";
    const sqlRes = await this.Sqlite_Run(sql, [key, json, expiryTime, execMillis]);
    if (sqlRes == 1)
    {
      res = true;
    }

    return res;
  }

  async delete(key)
  {
    let res = false;

    const sql = "delete from cache where key = ?";
    const sqlRes = await this.Sqlite_Run(sql, [key]);
    if (sqlRes == 1)
    {
      res = true;
    }

    return res;
  }
}

module.exports = CacheMem;
