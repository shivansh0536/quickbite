const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Create a Restaurant Owner
    const ownerPassword = await bcrypt.hash('password123', 10);

    // Check if owner exists to avoid duplicates
    let owner = await prisma.user.findUnique({
        where: { email: 'owner@example.com' }
    });

    if (!owner) {
        owner = await prisma.user.create({
            data: {
                name: 'Restaurant Owner',
                email: 'owner@example.com',
                password: ownerPassword,
                role: 'RESTAURANT_OWNER',
                phone: '1234567890',
                address: '123 Culinary Ave',
            },
        });
        console.log('Created restaurant owner:', owner.email);
    } else {
        console.log('Restaurant owner already exists:', owner.email);
    }

    // 2. Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);

    let admin = await prisma.user.findUnique({
        where: { email: 'admin@quickbite.com' }
    });

    if (!admin) {
        admin = await prisma.user.create({
            data: {
                name: 'Admin User',
                email: 'admin@quickbite.com',
                password: adminPassword,
                role: 'ADMIN',
                phone: '9999999999',
                address: 'Admin Office',
            },
        });
        console.log('Created admin user:', admin.email);
    } else {
        console.log('Admin user already exists:', admin.email);
    }

    // 3. Create Restaurants
    const restaurantsData = [
        {
            name: 'Burger King',
            description: 'Home of the Whopper',
            cuisine: 'American',
            address: '456 Burger Lane',
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            menuItems: [
                {
                    name: 'Whopper',
                    description: 'Flame-grilled beef patty with fresh ingredients',
                    price: 479,
                    category: 'Burgers',
                    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Double Whopper',
                    description: 'Two flame-grilled patties with all the fixings',
                    price: 639,
                    category: 'Burgers',
                    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Chicken Sandwich',
                    description: 'Crispy chicken breast with lettuce and mayo',
                    price: 399,
                    category: 'Burgers',
                    imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Chicken Fries',
                    description: 'Breaded chicken strips shaped like fries',
                    price: 319,
                    category: 'Sides',
                    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Onion Rings',
                    description: 'Crispy golden onion rings',
                    price: 239,
                    category: 'Sides',
                    imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Chocolate Shake',
                    description: 'Thick and creamy chocolate milkshake',
                    price: 279,
                    category: 'Drinks',
                    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
            ],
        },
        {
            name: 'Pizza Hut',
            description: 'Delicious pizzas and wings',
            cuisine: 'Italian',
            address: '789 Pizza Place',
            rating: 4.2,
            imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            menuItems: [
                {
                    name: 'Pepperoni Pizza',
                    description: 'Classic pepperoni pizza with mozzarella cheese',
                    price: 1039,
                    category: 'Pizza',
                    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Margherita Pizza',
                    description: 'Fresh mozzarella, tomatoes, and basil',
                    price: 959,
                    category: 'Pizza',
                    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Meat Lovers Pizza',
                    description: 'Loaded with pepperoni, sausage, bacon, and ham',
                    price: 1279,
                    category: 'Pizza',
                    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Buffalo Wings',
                    description: 'Spicy buffalo chicken wings',
                    price: 719,
                    category: 'Sides',
                    imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Breadsticks',
                    description: 'Warm breadsticks with marinara sauce',
                    price: 399,
                    category: 'Sides',
                    imageUrl: 'https://images.unsplash.com/photo-1573145402636-613612502836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=080',
                    isAvailable: true,
                },
                {
                    name: 'Cinnamon Sticks',
                    description: 'Sweet cinnamon breadsticks with icing',
                    price: 479,
                    category: 'Dessert',
                    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
            ],
        },
        {
            name: 'Sushi Master',
            description: 'Authentic Japanese sushi and sashimi',
            cuisine: 'Japanese',
            address: '101 Sushi Street',
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            menuItems: [
                {
                    name: 'California Roll',
                    description: 'Crab, avocado, and cucumber roll',
                    price: 719,
                    category: 'Sushi',
                    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Spicy Tuna Roll',
                    description: 'Spicy tuna with cucumber',
                    price: 799,
                    category: 'Sushi',
                    imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Dragon Roll',
                    description: 'Eel and avocado with special sauce',
                    price: 1039,
                    category: 'Sushi',
                    imageUrl: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Salmon Sashimi',
                    description: 'Fresh salmon slices',
                    price: 1199,
                    category: 'Sashimi',
                    imageUrl: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Tuna Sashimi',
                    description: 'Fresh tuna slices',
                    price: 1279,
                    category: 'Sashimi',
                    imageUrl: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Miso Soup',
                    description: 'Traditional Japanese soup',
                    price: 319,
                    category: 'Soup',
                    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
            ],
        },
        {
            name: 'Taco Bell',
            description: 'Live Mas with tacos and burritos',
            cuisine: 'Mexican',
            address: '202 Taco Blvd',
            rating: 4.0,
            imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            menuItems: [
                {
                    name: 'Crunchy Taco',
                    description: 'Seasoned beef in a crunchy corn shell',
                    price: 159,
                    category: 'Tacos',
                    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Soft Taco',
                    description: 'Seasoned beef in a soft flour tortilla',
                    price: 159,
                    category: 'Tacos',
                    imageUrl: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Bean Burrito',
                    description: 'Beans, cheese, and onions in a flour tortilla',
                    price: 199,
                    category: 'Burritos',
                    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Beef Burrito Supreme',
                    description: 'Beef, beans, sour cream, lettuce, and tomatoes',
                    price: 319,
                    category: 'Burritos',
                    imageUrl: 'https://images.unsplash.com/photo-1641844530426-3e8e0c1d7f0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Nachos Supreme',
                    description: 'Tortilla chips with cheese, beef, and toppings',
                    price: 399,
                    category: 'Sides',
                    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Quesadilla',
                    description: 'Grilled tortilla with melted cheese',
                    price: 279,
                    category: 'Sides',
                    imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
            ],
        },
        {
            name: 'The Steakhouse',
            description: 'Premium cuts and fine dining',
            cuisine: 'American',
            address: '303 Steak Street',
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            menuItems: [
                {
                    name: 'Ribeye Steak',
                    description: '12oz premium ribeye',
                    price: 2319,
                    category: 'Steaks',
                    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Loaded Baked Potato',
                    description: 'Baked potato with all the fixings',
                    price: 479,
                    category: 'Sides',
                    imageUrl: 'https://images.unsplash.com/photo-1568158879083-c42860933ed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
            ],
        },
        {
            name: 'Thai Spice',
            description: 'Authentic Thai cuisine',
            cuisine: 'Thai',
            address: '404 Bangkok Ave',
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            menuItems: [
                {
                    name: 'Pad Thai',
                    description: 'Stir-fried rice noodles',
                    price: 959,
                    category: 'Noodles',
                    imageUrl: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Green Curry',
                    description: 'Spicy coconut curry',
                    price: 1119,
                    category: 'Curry',
                    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
            ],
        },
        {
            name: 'China Garden',
            description: 'Traditional Chinese dishes',
            cuisine: 'Chinese',
            address: '505 Dragon Road',
            rating: 4.3,
            imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            menuItems: [
                {
                    name: 'Kung Pao Chicken',
                    description: 'Spicy stir-fried chicken',
                    price: 879,
                    category: 'Main',
                    imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Fried Rice',
                    description: 'Classic fried rice',
                    price: 639,
                    category: 'Rice',
                    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
            ],
        },
        {
            name: 'Pasta Paradise',
            description: 'Fresh homemade pasta',
            cuisine: 'Italian',
            address: '606 Noodle Lane',
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            menuItems: [
                {
                    name: 'Fettuccine Alfredo',
                    description: 'Creamy pasta with parmesan',
                    price: 1199,
                    category: 'Pasta',
                    imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Tiramisu',
                    description: 'Classic Italian dessert',
                    price: 6.99,
                    category: 'Dessert',
                    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
            ],
        },
        {
            name: 'BBQ Pit',
            description: 'Slow-smoked meats',
            cuisine: 'American',
            address: '707 Smoke Street',
            rating: 4.4,
            imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            menuItems: [
                {
                    name: 'Pulled Pork',
                    description: 'Slow-smoked pulled pork',
                    price: 1039,
                    category: 'BBQ',
                    imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Mac and Cheese',
                    description: 'Creamy mac and cheese',
                    price: 399,
                    category: 'Sides',
                    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
            ],
        },
        {
            name: 'Curry House',
            description: 'Indian flavors and spices',
            cuisine: 'Indian',
            address: '808 Spice Road',
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            menuItems: [
                {
                    name: 'Chicken Tikka Masala',
                    description: 'Creamy tomato curry',
                    price: 1119,
                    category: 'Curry',
                    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Garlic Naan',
                    description: 'Fresh baked naan bread',
                    price: 319,
                    category: 'Bread',
                    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
            ],
        },
        {
            name: 'Pho House',
            description: 'Vietnamese noodle soup',
            cuisine: 'Vietnamese',
            address: '909 Saigon Street',
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            menuItems: [
                {
                    name: 'Beef Pho',
                    description: 'Traditional Vietnamese soup',
                    price: 959,
                    category: 'Soup',
                    imageUrl: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Spring Rolls',
                    description: 'Fresh vegetable rolls',
                    price: 479,
                    category: 'Appetizer',
                    imageUrl: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
            ],
        },
        {
            name: 'Mediterranean Grill',
            description: 'Fresh Mediterranean cuisine',
            cuisine: 'Mediterranean',
            address: '1010 Olive Avenue',
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            menuItems: [
                {
                    name: 'Gyro Plate',
                    description: 'Lamb gyro with tzatziki',
                    price: 1039,
                    category: 'Main',
                    imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
                {
                    name: 'Hummus Platter',
                    description: 'Fresh hummus with pita',
                    price: 639,
                    category: 'Appetizer',
                    imageUrl: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    isAvailable: true,
                },
            ],
        },
    ];

    for (const r of restaurantsData) {
        const restaurant = await prisma.restaurant.create({
            data: {
                name: r.name,
                description: r.description,
                cuisine: r.cuisine,
                address: r.address,
                rating: r.rating,
                imageUrl: r.imageUrl,
                ownerId: owner.id,
                menuItems: {
                    create: r.menuItems,
                },
            },
        });
        console.log(`Created restaurant with id: ${restaurant.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
