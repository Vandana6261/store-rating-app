const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Seeding Master Admin...');

  const adminEmail = 'admin@storerating.com';
  const adminPassword = 'AdminPassword123!';

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  // Use Upsert to safely create or skip the admin
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // Do nothing if they already exist
    create: {
      email: adminEmail,
      name: 'Master Admin',
      password: hashedPassword,
      address: 'Admin Headquarters',
      role: 'ADMIN',
    },
  });

  console.log(`✅ Master Admin seeded successfully!`);
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
