const { login } = require('../services/authService');
const { success, failure } = require('../utils/response');
async function loginUser(req, res, next) { try { const result = await login(req.body.identifier, req.body.password); return result ? success(res, 'Login successful', result) : failure(res, 'Invalid credentials', 'Email/username or password is incorrect', 401); } catch (error) { next(error); } }
function currentUser(req, res) { return success(res, 'User retrieved', { user: req.user }); }
module.exports = { loginUser, currentUser };
