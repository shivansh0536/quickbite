const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(restaurantController.getAllRestaurants)
    .post(protect, authorize('RESTAURANT_OWNER', 'ADMIN'), restaurantController.createRestaurant);

router.route('/:id')
    .get(restaurantController.getRestaurantById)
    .put(protect, authorize('RESTAURANT_OWNER', 'ADMIN'), restaurantController.updateRestaurant)
    .delete(protect, authorize('RESTAURANT_OWNER', 'ADMIN'), restaurantController.deleteRestaurant);

module.exports = router;
