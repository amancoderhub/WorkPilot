const express = require('express');
const router = express.Router();
const { getMe, updateUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getMe);
router.put('/profile', protect, updateUser);

module.exports = router;
