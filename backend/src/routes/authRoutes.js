const router = require('express').Router();
const controller = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { loginRules } = require('../utils/validation');
router.post('/login', loginRules, controller.loginUser);
router.get('/user', authenticate, controller.currentUser);
module.exports = router;
