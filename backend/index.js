const express = require('express');
const CacheMem = require('../src/Server_Cache_Mem');

const cache = new CacheMem();

const app = express();
app.get('/someFunction', getSomeFunction);
app.get('/someFunctionCached', getSomeFunctionCached);
app.use(express.static('frontend'));
app.use(express.static('src'));
app.listen(80);

function getSomeFunction(req, res)
{
  const a = parseInt(req.query.a);
  const funRes = someFunction(a);
  res.send({funRes});
}

async function getSomeFunctionCached(req, res)
{
  const a = parseInt(req.query.a);
  const funRes = await someFunctionCached(a);
  res.send({funRes});
}

async function someFunctionCached(a)
{
  const key = "someFunctionCached."+a;
  const res = await cache.use(key, () => someFunction(a), 10000);
  return res;
}

function someFunction(a)
{
  let res = 0;

  for (let i=0; i<a; i++)
  {
    res += i;
  }

  return res;
}