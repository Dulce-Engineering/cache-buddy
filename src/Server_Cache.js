
class CacheBase
{
  constructor(config)
  {
    this.forceRefresh = false;
    this.expiryMillis = config?.expiryMillis || 1000*60*30; // 30 min
    this.cacheOn = config?.cacheOn!=null ? config.cacheOn : true;
  }

  async use(key, calcFn, expiryMillis)
  {
    let res;

    if (this.cacheOn)
    {
      if (!this.forceRefresh && await this.hasData(key))
      {
        res = await this.get(key);
      }
      else
      {
        const startTime = Date.now();
        res = await calcFn();
        const execMillis = Date.now() - startTime;
        
        await this.delete(key);

        if (!expiryMillis)
        {
          expiryMillis = this.expiryMillis;
        }    
        await this.set(key, res, execMillis, expiryMillis);
        this.forceRefresh = false;
      }
    }
    else
    {
      res = await calcFn();
    }

    return res;
  }

  async hasData(key)
  {
    return false;
  }

  async get(key)
  {
    return null;
  }

  async delete(key)
  {
    return false;
  }

  async set(key, data, execMillis, expiryMillis)
  {
    return false;
  }
}

module.exports = CacheBase;
