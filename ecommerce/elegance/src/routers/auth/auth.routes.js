const { body } = require('express-validator');
const { httpLogin, httpGetProfile } = require('./auth.controller');
const authMiddleware = require('../../middleware/auth');

const router = require('express').Router();

// Login route for both users and admin
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ],
  httpLogin
);

// Get current user profile (protected route)
router.get('/profile', authMiddleware, httpGetProfile);

// 404 fallback
router.use((req, res) => {
  res.status(404).json({ message: 'Auth route not found!' });
});

module.exports = router;
