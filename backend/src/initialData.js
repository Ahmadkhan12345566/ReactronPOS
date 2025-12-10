import { Product, Category, Brand, Unit, Customer, User, Supplier } from './models/index.js';

async function seedDatabase() {
  try {
    // Seed Categories
    const categories = await Category.bulkCreate([
      { name: 'Computers', slug: 'computers', status: 'Active' },
      { name: 'Electronics', slug: 'electronics', status: 'Active' },
      { name: 'Shoe', slug: 'shoe', status: 'Active' },
      { name: 'Cosmetics', slug: 'cosmetics', status: 'Active' },
      { name: 'Groceries', slug: 'groceries', status: 'Active' },
      { name: 'Furniture', slug: 'furniture', status: 'Active' },
      { name: 'Bags', slug: 'bags', status: 'Active' },
      { name: 'Phone', slug: 'phone', status: 'Active' },
      { name: 'Appliances', slug: 'appliances', status: 'Active' },
      { name: 'Clothing', slug: 'clothing', status: 'Active' },
    ]);

    // Seed Brands
    const brands = await Brand.bulkCreate([
      { name: 'Lenovo', image: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Lenovo_logo_2015.svg', status: 'Active' },
      { name: 'Beats', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Beats_Electronics_logo.svg', status: 'Active' },
      { name: 'Nike', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', status: 'Active' },
      { name: 'Apple', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', status: 'Active' },
      { name: 'Amazon', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', status: 'Active' },
      { name: 'Woodmart', image: 'https://woodmart.xtemos.com/wp-content/uploads/2017/01/logo-white.png', status: 'Active' },
      { name: 'Dior', image: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Christian_Dior_Logo.svg', status: 'Active' },
      { name: 'Lava', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Lava_International_logo.svg', status: 'Active' },
      { name: 'Nilkamal', image: 'https://upload.wikimedia.org/wikipedia/en/4/44/Nilkamal_Logo.png', status: 'Active' },
      { name: 'The North Face', image: 'https://upload.wikimedia.org/wikipedia/commons/9/94/The_North_Face_logo.svg', status: 'Active' },
    ]);

    // Seed Units
    const units = await Unit.bulkCreate([
      { name: 'Kilograms', short_name: 'kg', status: 'Active' },
      { name: 'Liters', short_name: 'L', status: 'Active' },
      { name: 'Dozen', short_name: 'dz', status: 'Active' },
      { name: 'Pieces', short_name: 'pcs', status: 'Active' },
      { name: 'Boxes', short_name: 'bx', status: 'Active' },
      { name: 'Tons', short_name: 't', status: 'Active' },
      { name: 'Grams', short_name: 'g', status: 'Active' },
      { name: 'Meters', short_name: 'm', status: 'Active' },
      { name: 'Centimeters', short_name: 'cm', status: 'Active' },
    ]);

    // Seed Products
    const products = await Product.bulkCreate([
      {
        code: "FD001",
        name: "Beef Burger",
        category: "food",
        brand: "CafeCo",
        price: 7.0,
        cost: 4.0,
        weight: 0.3,
        qty: 100,
        status: "Active",
        image: "assets/img/beef-burger.png",
        createdBy: "Admin",
        createdByAvatar: "assets/img/users/user-default.jpg",
        categoryId: categories[0].id,
        brandId: brands[0].id,
        unitId: units[0].id
      },
      // Add more products following the same pattern
    ]);

    // Seed Customers
    const customers = await Customer.bulkCreate([
      {
        code: 'CU001',
        name: 'Carl Evans',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        email: 'carlevans@example.com',
        phone: '+12163547758',
        address: '123 Main St',
        city: 'Berlin',
        country: 'Germany',
        status: 'Active'
      },
      // Add more customers
    ]);

    // In initialData.js
const users = await User.bulkCreate([
  {
    code: 'USR001',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'hashed_password', // You should hash this
    role: 'admin',
    status: 'Active'
  },
  {
    code: 'BLR001',
    name: 'Carl Evans',
    email: 'carl.evans@example.com',
    password: 'hashed_password',
    role: 'biller',
    company: 'Apple',
    status: 'Active'
  },
  // Add more users...
]);

    // Seed Suppliers
    const suppliers = await Supplier.bulkCreate([
      {
        code: 'SUP001',
        name: 'Carl Evans',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        email: 'carl.evans@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        products: 'Electronics, Furniture',
        status: 'Active'
      },
      // Add more suppliers
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

export { seedDatabase };