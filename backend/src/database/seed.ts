import { DataSource } from 'typeorm';
import { User, UserRole, Table, TableStatus, Category, MenuItem } from '../entities';
import * as bcrypt from 'bcryptjs';

export const seedDatabase = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const tableRepository = dataSource.getRepository(Table);
  const categoryRepository = dataSource.getRepository(Category);
  const menuItemRepository = dataSource.getRepository(MenuItem);

  // Check if data already exists
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = userRepository.create({
    email: 'admin@restaurant.com',
    firstName: 'Admin',
    lastName: 'User',
    password: hashedPassword,
    role: UserRole.ADMIN,
    isActive: true,
  });
  await userRepository.save(adminUser);

  // Create waiter user
  const waiterUser = userRepository.create({
    email: 'waiter@restaurant.com',
    firstName: 'Garson',
    lastName: 'Kullanıcı',
    password: hashedPassword,
    role: UserRole.WAITER,
    isActive: true,
  });
  await userRepository.save(waiterUser);

  // Create chef user
  const chefUser = userRepository.create({
    email: 'chef@restaurant.com',
    firstName: 'Şef',
    lastName: 'Kullanıcı',
    password: hashedPassword,
    role: UserRole.CHEF,
    isActive: true,
  });
  await userRepository.save(chefUser);

  // Create tables
  const tables: Table[] = [];
  for (let i = 1; i <= 10; i++) {
    const table = tableRepository.create({
      tableNumber: i,
      capacity: Math.floor(Math.random() * 4) + 2, // 2-6 kişilik
      status: TableStatus.AVAILABLE,
      location: i <= 5 ? 'İç Mekan' : 'Teras',
    });
    try {
      const savedTable = await tableRepository.save(table);
      tables.push(savedTable);
    } catch (error) {
      console.error('Error saving table:', error);
    }
  }

  // Create categories
  const categories: Category[] = [];
  const categoryData = [
    { name: 'Ana Yemekler', description: 'Ana yemek seçenekleri' },
    { name: 'Çorbalar', description: 'Sıcak çorbalar' },
    { name: 'Salatalar', description: 'Taze salatalar' },
    { name: 'İçecekler', description: 'Soğuk ve sıcak içecekler' },
    { name: 'Tatlılar', description: 'Ev yapımı tatlılar' },
  ];

  for (const catData of categoryData) {
    const category = categoryRepository.create({
      ...catData,
      isActive: true,
    });
    try {
      const savedCategory = await categoryRepository.save(category);
      categories.push(savedCategory);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  }

  // Create menu items
  const menuItems = [
    {
      name: 'Karışık Pizza',
      description: 'Sucuk, sosis, mantar, biber ile',
      price: 85.00,
      category: categories[0],
      isAvailable: true,
    },
    {
      name: 'Mercimek Çorbası',
      description: 'Geleneksel mercimek çorbası',
      price: 25.00,
      category: categories[1],
      isAvailable: true,
    },
    {
      name: 'Sezar Salata',
      description: 'Marul, tavuk, parmesan peyniri ile',
      price: 45.00,
      category: categories[2],
      isAvailable: true,
    },
    {
      name: 'Ayran',
      description: 'Soğuk ayran',
      price: 8.00,
      category: categories[3],
      isAvailable: true,
    },
    {
      name: 'Tiramisu',
      description: 'İtalyan usulü tiramisu',
      price: 35.00,
      category: categories[4],
      isAvailable: true,
    },
  ];

  for (const itemData of menuItems) {
    const menuItem = menuItemRepository.create(itemData);
    try {
      await menuItemRepository.save(menuItem);
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  }

  console.log('Database seeded successfully!');
  console.log('Default users:');
  console.log('- Admin: admin@restaurant.com / admin123');
  console.log('- Waiter: waiter@restaurant.com / admin123');
  console.log('- Chef: chef@restaurant.com / admin123');
}; 