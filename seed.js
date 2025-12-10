import connectDB from './config/db.js';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import * as Models from './models/index.js';

const {
  Brand,
  Category,
  Customer,
  Inventory,
  Product,
  ProductVariant,
  Supplier,
  Unit,
  User,
  Store,
} = Models;

// --- Static Data Definition ---

const CATEGORIES = [
  { name: 'Burgers & Sandwiches' },
  { name: 'Pizza' },
  { name: 'Broast & Fried Chicken' },
  { name: 'Sides & Appetizers' },
  { name: 'Desserts' },
  { name: 'Beverages' },
];

const BRANDS = [
  { name: 'Lahori Bites' },
  { name: 'Karachi Crust Co.' },
  { name: 'Capital Crispy' },
];

const SUPPLIERS = [
  { name: 'Punjab Fresh Meats' },
  { name: 'Sindh Flour & Bakery' },
  { name: 'Islamabad Vegetable Supply' },
  { name: 'National Beverages Corp.' },
  { name: 'Pakistan Packaging Solutions' },
];

const UNITS = [{ name: 'Piece', short_name: 'pc' }];

const FAST_FOOD_PRODUCTS = [
    { name: 'Classic Zinger Burger', category: 'Burgers & Sandwiches', brand: 'Lahori Bites', image: 'https://via.placeholder.com/300x200.png?text=Zinger+Burger', description: 'A crispy, juicy chicken fillet in a soft bun with mayo and lettuce.' },
    { name: 'Spicy Beef Burger', category: 'Burgers & Sandwiches', brand: 'Lahori Bites', image: 'https://via.placeholder.com/300x200.png?text=Beef+Burger', description: 'A fiery grilled beef patty with cheese, jalapenos, and a special sauce.' },
    { name: 'Chicken Shawarma Roll', category: 'Burgers & Sandwiches', brand: 'Lahori Bites', image: 'https://via.placeholder.com/300x200.png?text=Shawarma', description: 'Authentic Middle Eastern flavors wrapped in a soft pita bread.' },
    { name: 'Club Sandwich', category: 'Burgers & Sandwiches', brand: 'Lahori Bites', image: 'https://via.placeholder.com/300x200.png?text=Club+Sandwich', description: 'A double-layered sandwich with chicken, egg, and fresh vegetables.' },
    { name: 'Anda Shami Burger', category: 'Burgers & Sandwiches', brand: 'Lahori Bites', image: 'https://via.placeholder.com/300x200.png?text=Anda+Shami', description: 'The classic Pakistani street food burger with a lentil patty and egg.' },
    { name: 'Chicken Tikka Pizza', category: 'Pizza', brand: 'Karachi Crust Co.', image: 'https://via.placeholder.com/300x200.png?text=Tikka+Pizza', description: 'A desi twist on pizza with spicy chicken tikka, onions, and peppers.' },
    { name: 'Fajita Sicilian Pizza', category: 'Pizza', brand: 'Karachi Crust Co.', image: 'https://via.placeholder.com/300x200.png?text=Fajita+Pizza', description: 'A spicy mix of fajita-style chicken, onions, bell peppers, and cheese.' },
    { name: 'Cheese Lover Pizza', category: 'Pizza', brand: 'Karachi Crust Co.', image: 'https://via.placeholder.com/300x200.png?text=Cheese+Pizza', description: 'A simple classic with generous amounts of mozzarella cheese.' },
    { name: 'Veggie Delight Pizza', category: 'Pizza', brand: 'Karachi Crust Co.', image: 'https://via.placeholder.com/300x200.png?text=Veggie+Pizza', description: 'Loaded with fresh vegetables like bell peppers, onions, olives, and mushrooms.' },
    { name: 'Crispy Chicken Broast', category: 'Broast & Fried Chicken', brand: 'Capital Crispy', image: 'https://via.placeholder.com/300x200.png?text=Chicken+Broast', description: 'Quarter chicken piece, pressure fried to golden perfection, served with fries.' },
    { name: 'Hot Wings (6 pcs)', category: 'Broast & Fried Chicken', brand: 'Capital Crispy', image: 'https://via.placeholder.com/300x200.png?text=Hot+Wings', description: 'Spicy and tangy chicken wings, perfect as a snack.' },
    { name: 'Boneless Fried Strips (4 pcs)', category: 'Broast & Fried Chicken', brand: 'Capital Crispy', image: 'https://via.placeholder.com/300x200.png?text=Chicken+Strips', description: 'Crispy on the outside, tender on the inside chicken strips.' },
    { name: 'Masala Fries', category: 'Sides & Appetizers', brand: 'Lahori Bites', image: 'https://via.placeholder.com/300x200.png?text=Masala+Fries', description: 'Classic french fries tossed in a special blend of Pakistani spices.' },
    { name: 'Garlic Mayo Fries', category: 'Sides & Appetizers', brand: 'Lahori Bites', image: 'https://via.placeholder.com/300x200.png?text=Garlic+Mayo+Fries', description: 'French fries topped with a creamy garlic mayonnaise sauce.' },
    { name: 'Coleslaw', category: 'Sides & Appetizers', brand: 'Lahori Bites', image: 'https://via.placeholder.com/300x200.png?text=Coleslaw', description: 'A creamy and refreshing salad of shredded cabbage and carrots.' },
    { name: 'Molten Lava Cake', category: 'Desserts', brand: 'Karachi Crust Co.', image: 'https://via.placeholder.com/300x200.png?text=Lava+Cake', description: 'A decadent chocolate cake with a gooey, melted chocolate center.' },
    { name: 'Ice Cream Scoop', category: 'Desserts', brand: 'Karachi Crust Co.', image: 'https://via.placeholder.com/300x200.png?text=Ice+Cream', description: 'A single scoop of classic vanilla ice cream.' },
    { name: 'Coke / Pepsi', category: 'Beverages', brand: 'National Beverages Corp.', image: 'https://via.placeholder.com/300x200.png?text=Cola', description: 'An ice-cold carbonated cola drink.' },
    { name: 'Sprite / 7up', category: 'Beverages', brand: 'National Beverages Corp.', image: 'https://via.placeholder.com/300x200.png?text=Lemon-Lime+Soda', description: 'A refreshing lemon-lime carbonated drink.' },
];


// --- Helper Functions ---
const PAK_CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const phonePakistan = () => `03${rand(10, 49).toString().padStart(2, '0')}${rand(1000000, 9999999)}`;
const streetAddress = () => (faker.location && typeof faker.location.streetAddress === 'function') ? faker.location.streetAddress() : 'Main Street';
const personFullName = () => (faker.person && typeof faker.person.fullName === 'function') ? faker.person.fullName() : 'John Doe';
const generateCode = (length = 8) => (faker.string && typeof faker.string.alphanumeric === 'function') ? faker.string.alphanumeric(length) : Math.random().toString(36).substring(2, 2 + length);


async function clearAll() {
    console.log('Clearing existing data...');
    // Clear in order of dependencies
    const collections = [Inventory, ProductVariant, Product, Customer, Supplier, Category, Brand, Unit, Store, User];
    for (const Model of collections) {
        try {
            await Model.deleteMany({});
        } catch (err) {
            console.warn(`Could not clear collection ${Model.modelName}:`, err.message);
        }
    }
}

async function seed() {
    try {
        await connectDB();
        await clearAll();

        console.log('Seeding started...');

        // 1. Create Admin User
        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('Admin@123', salt);
        const admin = await User.create({ name: 'Admin User', email: 'admin@pos.local', password: adminPass, role: 'admin', status: 'Active' });
        console.log('Admin user created.');

        // 2. Create a single Store
        const store = await Store.create({ name: 'Islamabad Main Store', address: 'Islamabad, Pakistan', createdBy: admin._id });
        console.log('Main store created.');

        // 3. Create static collections
        const units = await Unit.insertMany(UNITS.map(u => ({ ...u, createdBy: admin._id })));
        const categories = await Category.insertMany(CATEGORIES.map(c => ({ ...c, createdBy: admin._id })));
        const brands = await Brand.insertMany(BRANDS.map(b => ({ ...b, createdBy: admin._id })));
        const suppliers = await Supplier.insertMany(
            SUPPLIERS.map(s => ({
                ...s,
                email: faker.internet.email(),
                phone: phonePakistan(),
                address: `${streetAddress()}, ${pick(PAK_CITIES)}, Pakistan`,
                status: 'Active',
                createdBy: admin._id,
            }))
        );
        console.log('Units, Categories, Brands, and Suppliers created.');

        // 4. Create Customers
        for (let i = 0; i < 15; i++) {
            await Customer.create({
                name: personFullName(),
                email: faker.internet.email(),
                phone: phonePakistan(),
                address: `${streetAddress()}, ${pick(PAK_CITIES)}, Pakistan`,
                city: pick(PAK_CITIES),
                country: 'Pakistan',
                status: 'Active',
                createdBy: admin._id,
            });
        }
        await Customer.create({ name: 'Walk-in Customer', phone: '00000000000', createdBy: admin._id });
        console.log('Customers created.');

        // 5. Create Products, Variants, and Inventory
        const categoryMap = new Map(categories.map(c => [c.name, c._id]));
        const brandMap = new Map(brands.map(b => [b.name, b._id]));

        for (const prod of FAST_FOOD_PRODUCTS) {
            const productDoc = await Product.create({
                name: prod.name,
                description: prod.description,
                image: prod.image,
                productType: 'single', // All fast-food items will be single products
                status: 'Active',
                brand: brandMap.get(prod.brand),
                category: categoryMap.get(prod.category),
                unit: units[0]._id, // All are 'Piece'
                supplier: pick(suppliers)._id,
                createdBy: admin._id,
            });

            const variantDoc = await ProductVariant.create({
                sku: `SKU-${generateCode(6).toUpperCase()}`,
                price: Number(faker.commerce.price({ min: 250, max: 1500, dec: 0 })),
                cost: Number(faker.commerce.price({ min: 100, max: 700, dec: 0 })),
                product: productDoc._id,
                createdBy: admin._id,
            });

            // Add inventory to the single store
            await Inventory.create({
                variant: variantDoc._id,
                store: store._id,
                qty: rand(50, 200), // Healthy stock
                quantityAlert: 10,
            });
        }
        console.log(`${FAST_FOOD_PRODUCTS.length} products with variants and inventory created.`);

        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('An error occurred during the seeding process:', err);
        process.exit(1);
    }
}

seed();
