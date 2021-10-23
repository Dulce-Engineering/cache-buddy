# Cache Buddy
JavaScript caching class supporting various persistence mechanisms, including memory. Designed for frontend and backend use with no dependencies except for the reqired datastore.

## Usage
- Instantiate required cache class
- Call cache.open() if relevant
- Create a key that is unique to the particular function and paramter combination
- Call cache.use() to retrieve a cached result or execute the required function
```
const key = "someFunction." + JSON.stringify({paramA, paramB, paramC});
const res = await cache.use(key, () => someFunction(paramA, paramB, paramC), 10000);
```

## Examples
Examples for the various datastores supported can be found in "frontend/index.html" and "backend/index.js".

## Supported Browser Datastores
- Memory
- LocalStorage
- SessionStorage
- IndexedDb
- Firebase Firestore
- Firebase Realtime Db

## Supported Server Datastores
- Memory
- Sqlite
- To do: Postgresql
- To do: Redis
- To do: Knex
