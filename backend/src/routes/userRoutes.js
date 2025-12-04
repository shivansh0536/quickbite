const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', protect, authorize('ADMIN'), userController.getAllUsers);
router.patch('/:id', protect, authorize('ADMIN'), userController.updateUser);
router.delete('/:id', protect, authorize('ADMIN'), userController.deleteUser);

module.exports = router;
