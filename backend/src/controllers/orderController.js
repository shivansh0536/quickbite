const prisma = require('../utils/prisma');

exports.createOrder = async (req, res) => {
    try {
        const { restaurantId, items } = req.body; // items: [{ menuItemId, quantity }]
        const userId = req.user.userId;

        // Calculate total amount and verify items
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const menuItem = await prisma.menuItem.findUnique({
                where: { id: item.menuItemId }
            });

            if (!menuItem) {
                return res.status(404).json({ message: `Menu item ${item.menuItemId} not found` });
            }

            totalAmount += menuItem.price * item.quantity;
            orderItemsData.push({
                menuItemId: item.menuItemId,
                name: menuItem.name,
                quantity: item.quantity,
                price: menuItem.price
            });
        }

        const order = await prisma.order.create({
            data: {
                userId,
                restaurantId,
                totalAmount,
                status: 'PENDING',
                items: orderItemsData
            }
        });

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user.role;

        let where = {};
        if (userRole === 'CUSTOMER') {
            where.userId = userId;
        } else if (userRole === 'RESTAURANT_OWNER') {
            // Find restaurants owned by user
            const restaurants = await prisma.restaurant.findMany({
                where: { ownerId: userId },
                select: { id: true }
            });
            const restaurantIds = restaurants.map(r => r.id);
            where.restaurantId = { in: restaurantIds };
        }
        // Admin sees all (empty where)

        const orders = await prisma.order.findMany({
            where,
            include: {
                user: { select: { name: true, email: true, address: true, phone: true } },
                restaurant: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { restaurant: true }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify authorization
        if (req.user.role === 'RESTAURANT_OWNER') {
            if (order.restaurant.ownerId !== req.user.userId) {
                return res.status(403).json({ message: 'Not authorized to update this order' });
            }
        } else if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.userId;

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        if (order.status !== 'PENDING') {
            return res.status(400).json({ message: 'Only pending orders can be cancelled' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' }
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only admin can delete
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to delete orders' });
        }

        await prisma.order.delete({
            where: { id: orderId }
        });

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
