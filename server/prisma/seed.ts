import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Safe deletion order (children before parents)
const DELETION_ORDER = [
  'sales',
  'purchases',
  'expenseByCategory',
  'expenses',
  'salesSummary',
  'purchaseSummary',
  'expenseSummary',
  'products',
  'users'
];

async function clearTables() {
  console.log('🗑️  Clearing existing data...');
  
  // Disable foreign key checks (PostgreSQL syntax)
  await prisma.$executeRaw`SET session_replication_role = 'replica';`;

  // Delete in safe order
  for (const model of DELETION_ORDER) {
    try {
      // @ts-ignore - Dynamic model access
      await prisma[model].deleteMany({});
      console.log(`   ✓ Cleared ${model}`);
    } catch (error) {
      console.error(`   ✗ Error clearing ${model}:`, error);
    }
  }

  // Re-enable constraints
  await prisma.$executeRaw`SET session_replication_role = 'origin';`;
}

async function seedModel(modelName: string, filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`   ⚠️  File not found: ${filePath}, skipping...`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  // @ts-ignore - Dynamic model access
  await prisma[modelName].createMany({
    data,
    skipDuplicates: true
  });
}

async function main() {
  // Determine the correct path based on environment
  // In Docker: seed.ts is compiled to dist/src/seed.js, seedData is at prisma/seedData
  // We need to go up to project root, then into prisma/seedData
  const seedDataPath = path.join(__dirname, '../prisma/seedData');
  
  console.log('🌱 Starting database seeding...');
  console.log('📂 Seed data path:', seedDataPath);

  const seedData = [
    { model: 'users', file: 'users.json' },
    { model: 'products', file: 'products.json' },
    { model: 'expenses', file: 'expenses.json' },
    { model: 'sales', file: 'sales.json' },
    { model: 'purchases', file: 'purchases.json' },
    { model: 'expenseSummary', file: 'expenseSummary.json' },
    { model: 'expenseByCategory', file: 'expenseByCategory.json' },
    { model: 'salesSummary', file: 'salesSummary.json' },
    { model: 'purchaseSummary', file: 'purchaseSummary.json' }
  ];

  try {
    // ALWAYS clear and reseed - no checking for existing data
    await clearTables();

    console.log('\n📦 Seeding tables...');
    for (const { model, file } of seedData) {
      const filePath = path.join(seedDataPath, file);
      await seedModel(model, filePath);
      console.log(`   ✅ Seeded ${model}`);
    }

    console.log('\n✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();