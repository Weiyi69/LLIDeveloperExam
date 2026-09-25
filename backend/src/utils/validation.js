const { body, param, query, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', error: errors.array().map(({ path, msg }) => `${path}: ${msg}`).join(', ') });
  next();
};

const loginRules = [body('identifier').trim().notEmpty().withMessage('Email or username is required'), body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'), handleValidation];
const employeeRules = [body('first_name').trim().isLength({ min: 2, max: 80 }).withMessage('First name must be 2-80 characters'), body('last_name').trim().isLength({ min: 2, max: 80 }).withMessage('Last name must be 2-80 characters'), body('email').isEmail().withMessage('Valid email is required'), body('contact_number').optional({ values: 'falsy' }).trim().isLength({ max: 30 }).withMessage('Contact number is too long'), body('department').trim().notEmpty().withMessage('Department is required'), body('position').trim().notEmpty().withMessage('Position is required'), body('status').isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'), handleValidation];
const idRule = [param('id').isInt({ min: 1 }).withMessage('Valid id is required'), handleValidation];
const reportRules = [query('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid status'), handleValidation];
module.exports = { loginRules, employeeRules, idRule, reportRules };
