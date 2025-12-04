const prisma = require('../utils/prisma');

exports.createRestaurant = async (req, res) => {
    try {
        const { name, description, cuisine, address, imageUrl } = req.body;
        const ownerId = req.user.userId;

        const restaurant = await prisma.restaurant.create({
            data: {
                name,
                description,
                cuisine,
                address,
                imageUrl,
                ownerId
            }
        });

        res.status(201).json(restaurant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllRestaurants = async (req, res) => {
    try {
        const { search, cuisine, minRating, sortBy, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const where = {};
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        if (cuisine) {
            where.cuisine = { contains: cuisine, mode: 'insensitive' };
        }
        if (minRating) {
            where.rating = { gte: parseFloat(minRating) };
        }

        let orderBy = { createdAt: 'desc' };
        if (sortBy === 'rating') {
            orderBy = { rating: 'desc' };
        } else if (sortBy === 'name') {
            orderBy = { name: 'asc' };
        } else if (sortBy === 'newest') {
            orderBy = { createdAt: 'desc' };
        }

        const restaurants = await prisma.restaurant.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy
        });

        const total = await prisma.restaurant.count({ where });

        res.json({
            restaurants,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: req.params.id },
            include: { menuItems: true }
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateRestaurant = async (req, res) => {
    try {
        const { name, description, cuisine, address, imageUrl } = req.body;
        const restaurantId = req.params.id;

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId }
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check ownership
        if (restaurant.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to update this restaurant' });
        }

        const updatedRestaurant = await prisma.restaurant.update({
            where: { id: restaurantId },
            data: { name, description, cuisine, address, imageUrl }
        });

        res.json(updatedRestaurant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.id;

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId }
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Check ownership
        if (restaurant.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
        }

        await prisma.restaurant.delete({ where: { id: restaurantId } });

        res.json({ message: 'Restaurant deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
