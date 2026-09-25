const router = require('express').Router();
const controller = require('../controllers/employeeController');
const { authenticate } = require('../middleware/auth');
const { reportRules } = require('../utils/validation');
router.get('/employees', authenticate, reportRules, controller.report);
module.exports = router;
