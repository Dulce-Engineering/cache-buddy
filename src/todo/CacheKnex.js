const CacheBase = require("./CacheBase");

class CacheKnex extends CacheBase
{
  async hasData(key)
  {
    let res = false;

    const sql = "select id from cache where key = ? and expiry_time > now()";
    const sqlRes = await this.db.raw(sql, [key]);
    if (sqlRes && sqlRes.rows && sqlRes.rows.length>0)
    {
      res = true;
    }

    return res;
  }

  async get(key)
  {
    let res;

    const sql = "select data from cache where key = ?";
    const sqlRes = await this.db.raw(sql, [key]);
    if (sqlRes && sqlRes.rows && sqlRes.rows.length>0)
    {
      const json = sqlRes.rows[0].data;
      res = JSON.parse(json);
    }

    return res;
  }

  async delete(key)
  {
    let res = false;

    const sql = "delete from cache where key = ?";
    const sqlRes = await this.db.raw(sql, [key]);
    if (sqlRes && sqlRes.rowCount)
    {
      res = true;
    }

    return res;
  }

  async set(key, data, execMillis, expiryMillis)
  {
    let res = false, json = null;

    const sql = "insert into cache (key, data, expiry_time, exec_millis) "+
      "values (?, ?, ?, ?) returning id";
    let expiryTime = new Date(Date.now() + expiryMillis);
    if (data)
    {
      json = JSON.stringify(data);
    }

    const sqlRes = await this.db.raw(sql, [key, json, expiryTime, execMillis]);
    if (sqlRes && sqlRes.rowCount)
    {
      console.log("CacheKnex.set(): cache write to id ", sqlRes.rows[0].id);
      res = true;
    }

    return res;
  }
}

module.exports = CacheKnex;
