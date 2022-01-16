
class Client_Cache
{
  constructor(config)
  {
    this.forceRefresh = false;
    this.expiryMillis = config?.expiryMillis || 1000*60*30; // 30 min
    this.cacheOn = config?.cacheOn!=null ? config.cacheOn : true;
    this.showLog = config?.showLog!=null ? config.showLog : true;
  }

  async use(key, calcFn, expiryMillis, map_fn)
  {
    let res;

    if (this.cacheOn)
    {
      if (!this.forceRefresh && await this.hasData(key))
      {
        this.log("cache hit");
        res = await this.get(key);
        if (map_fn)
          res = map_fn(res);
      }
      else
      {
        this.log("cache miss");
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

  log()
  {
    if (this.showLog)
    {
      const label = "Client_Cache: ";
      console.log(label, ...arguments);
    }
  }
}

export default Client_Cache;
