const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, getPool } = require('../config/database');
const { dbMode, jwtSecret, jwtExpiresIn } = require('../config/env');

const demoUsers = [
  { id: 1, username: 'admin', email: 'admin@employeehub.local', password_hash: '$2b$10$UIpTbWHXKXjKYO6QYklApeKnWh9g5AoNQp2HIQIgQcLdzL3sLWsai', role: 'admin' },
  { id: 2, username: 'viewer', email: 'viewer@employeehub.local', password_hash: '$2b$10$UIpTbWHXKXjKYO6QYklApeKnWh9g5AoNQp2HIQIgQcLdzL3sLWsai', role: 'viewer' },
]

async function login(identifier, password) {
  let user
  if (dbMode === 'memory') {
    user = demoUsers.find((candidate) => candidate.username === identifier || candidate.email === identifier)
  } else {
    const pool = await getPool()
    const result = await pool.request().input('identifier', sql.NVarChar, identifier).query('SELECT id, username, email, password_hash, role FROM users WHERE username = @identifier OR email = @identifier')
    user = result.recordset[0]
  }

  if (!user || !(await bcrypt.compare(password, user.password_hash))) return null;
  const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
  const { password_hash, ...safeUser } = user;
  return { token, user: safeUser };
}
module.exports = { login };
