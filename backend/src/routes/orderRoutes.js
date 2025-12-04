const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('CUSTOMER'), orderController.createOrder);
router.get('/', protect, orderController.getOrders);
router.patch('/:id/status', protect, authorize('RESTAURANT_OWNER', 'ADMIN'), orderController.updateOrderStatus);
router.patch('/:id/cancel', protect, authorize('CUSTOMER'), orderController.cancelOrder);
router.delete('/:id', protect, authorize('ADMIN'), orderController.deleteOrder);

module.exports = router;
