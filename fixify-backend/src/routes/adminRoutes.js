const express = require('express');
const router = express.Router();
const {
  getStats,
  getRecentActivity,
  getAllUsers,
  getAllProviders,
  verifyProvider,
  getAllBookings,
  getAllReviews,
  updateReviewStatus,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect, admin);

router.get('/stats', getStats);
router.get('/activity', getRecentActivity);
router.get('/users', getAllUsers);
router.get('/providers', getAllProviders);
router.put('/providers/:id/verify', verifyProvider);
router.get('/bookings', getAllBookings);
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/status', updateReviewStatus);

module.exports = router;