const sql = require('mssql');
const { db } = require('./env');

let poolPromise;
function getPool() {
  if (!poolPromise) poolPromise = new sql.ConnectionPool({
    user: db.user,
    password: db.password,
    server: db.server,
    port: db.port,
    database: db.database,
    options: db.options,
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
  }).connect();
  return poolPromise;
}

module.exports = { sql, getPool };
