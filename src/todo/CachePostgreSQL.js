const Utils = require('../utils');
const CacheBase = require("./CacheBase");

class CachePostgreSQL extends CacheBase
{
  constructor(config)
  {
    super(config);
    this.db = config.db;
  }

  async hasData(key)
  {
    let res = false;

    const sql = "select true from cache where key = $1 and expiry_time > now()";
    const sqlValue = await this.db.selectValue(sql, [key]);
    res = Utils.toBoolean(sqlValue);

    return res;
  }

  async get(key)
  {
    let res;

    const sql = "select data from cache where key = $1";
    const data = await this.db.selectValue(sql, [key]);
    if (data)
    {
      res = JSON.parse(data);
    }

    return res;
  }

  async delete(key)
  {
    let res = false;

    const sql = "delete from cache where key = $1";
    const sqlRes = await this.db.query(sql, [key]);
    if (sqlRes && sqlRes.rowCount)
    {
      res = true;
    }

    return res;
  }

  async set(key, data, execMillis, expiryMillis)
  {
    let res = false, json = null;

    let expiryTime = new Date(Date.now() + expiryMillis);
    if (data)
    {
      json = JSON.stringify(data);
    }

    const sql = "insert into cache (key, data, expiry_time, exec_millis) "+
      "values ($1, $2, $3, $4) returning id";
    const sqlRes = await this.db.query(sql, [key, json, expiryTime, execMillis]);
    if (sqlRes && sqlRes.rowCount)
    {
      console.log("CachePostgreSQL.set(): cache write to id ", sqlRes.rows[0].id);
      res = true;
    }

    return res;
  }
}

module.exports = CachePostgreSQL;
