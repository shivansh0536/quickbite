const prisma = require('../utils/prisma');

exports.addMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, imageUrl, restaurantId } = req.body;

        // Verify ownership of the restaurant
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId }
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        if (restaurant.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to add items to this restaurant' });
        }

        const menuItem = await prisma.menuItem.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                imageUrl,
                restaurantId
            }
        });

        res.status(201).json(menuItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, imageUrl, isAvailable } = req.body;
        const menuItemId = req.params.id;

        const menuItem = await prisma.menuItem.findUnique({
            where: { id: menuItemId },
            include: { restaurant: true }
        });

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        if (menuItem.restaurant.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to update this item' });
        }

        const updatedItem = await prisma.menuItem.update({
            where: { id: menuItemId },
            data: {
                name,
                description,
                price: price ? parseFloat(price) : undefined,
                category,
                imageUrl,
                isAvailable
            }
        });

        res.json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        const menuItemId = req.params.id;

        const menuItem = await prisma.menuItem.findUnique({
            where: { id: menuItemId },
            include: { restaurant: true }
        });

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        if (menuItem.restaurant.ownerId !== req.user.userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to delete this item' });
        }

        await prisma.menuItem.delete({ where: { id: menuItemId } });

        res.json({ message: 'Menu item deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMenuByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const menuItems = await prisma.menuItem.findMany({
            where: { restaurantId }
        });
        res.json(menuItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
