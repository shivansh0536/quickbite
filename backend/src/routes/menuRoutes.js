const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('RESTAURANT_OWNER', 'ADMIN'), menuController.addMenuItem);
router.put('/:id', protect, authorize('RESTAURANT_OWNER', 'ADMIN'), menuController.updateMenuItem);
router.delete('/:id', protect, authorize('RESTAURANT_OWNER', 'ADMIN'), menuController.deleteMenuItem);
router.get('/restaurant/:restaurantId', menuController.getMenuByRestaurant);

module.exports = router;
