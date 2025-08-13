import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Safe deletion order (children before parents)
const DELETION_ORDER = [
  'sales',           // Depends on products
  'purchases',       // Depends on products
  'expenseByCategory', // Depends on expenseSummary
  'products',        // Independent
  'users',           // Independent
  'expenses',
  'salesSummary',
  'purchaseSummary',
  'expenseSummary'
];

async function clearTables() {
  // Disable foreign key checks (PostgreSQL syntax)
  await prisma.$executeRaw`ALTER TABLE "Sales" DISABLE TRIGGER ALL`;
  await prisma.$executeRaw`ALTER TABLE "Purchases" DISABLE TRIGGER ALL`;
  await prisma.$executeRaw`ALTER TABLE "ExpenseByCategory" DISABLE TRIGGER ALL`;

  // Delete in safe order
  for (const model of DELETION_ORDER) {
    try {
      // @ts-ignore - Dynamic model access
      await prisma[model].deleteMany({});
      console.log(`Cleared ${model}`);
    } catch (error) {
      console.error(`Error clearing ${model}:`, error);
    }
  }

  // Re-enable constraints
  await prisma.$executeRaw`ALTER TABLE "Sales" ENABLE TRIGGER ALL`;
  await prisma.$executeRaw`ALTER TABLE "Purchases" ENABLE TRIGGER ALL`;
  await prisma.$executeRaw`ALTER TABLE "ExpenseByCategory" ENABLE TRIGGER ALL`;
}

async function seedModel(modelName: string, filePath: string) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  // @ts-ignore - Dynamic model access
  await prisma[modelName].createMany({
    data,
    skipDuplicates: true
  });
}

async function main() {
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
    console.log('Clearing existing data...');
    await clearTables();

    for (const { model, file } of seedData) {
      await seedModel(
        model,
        path.join(__dirname, 'seedData', file)
      );
      console.log(`Seeded ${model}`);
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();