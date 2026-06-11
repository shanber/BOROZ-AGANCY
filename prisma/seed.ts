import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // 1. Clear existing data (soft delete only)
    console.log('🗑️ Clearing existing test data...');
    // In production, be careful with this!

    // 2. Create Admin User
    console.log('👤 Creating admin user...');
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'المسؤول',
        password: await bcrypt.hash('ChangeMe123!', 12),
        phone: '+966501234567',
        isActive: true,
        globalRole: 'ADMIN',
      },
    });
    console.log(`✅ Admin user: ${adminUser.email}`);

    // 3. Create Demo Organization
    console.log('🏢 Creating demo organization...');
    const demoOrg = await prisma.organization.upsert({
      where: { slug: 'boroz-demo' },
      update: {},
      create: {
        name: 'BOROZ Demo',
        slug: 'boroz-demo',
        website: 'https://demo.boroz.com',
        isActive: true,
      },
    });
    console.log(`✅ Organization: ${demoOrg.name}`);

    // 4. Create Organization Member
    console.log('👥 Creating organization member...');
    await prisma.organizationMember.upsert({
      where: {
        userId_orgId: {
          userId: adminUser.id,
          orgId: demoOrg.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        orgId: demoOrg.id,
        role: 'SUPER_ADMIN',
      },
    });
    console.log(`✅ Member added to organization`);

    // 5. Create Subscription Plan
    console.log('💳 Creating subscription plan...');
    await prisma.organizationPlan.upsert({
      where: { orgId: demoOrg.id },
      update: {},
      create: {
        orgId: demoOrg.id,
        plan: 'STARTER',
        monthlyLimit: 100,
        currentMonth: 15,
      },
    });
    console.log(`✅ Plan: STARTER (100/month)`);

    // 6. Seed service taxonomy
    console.log('🛠️ Seeding service taxonomy via seed-services.js...');
    console.log('   Use "node prisma/seed-services.js" for full taxonomy seeding.');
    console.log('   Skipping inline service creation (schema evolved).');

    // 7. Create Demo Merchant
    console.log('🏪 Creating demo merchant...');
    await prisma.merchant.create({
      data: {
        orgId: demoOrg.id,
        storeName: 'متجر تجريبي بروز',
        storeUrl: 'https://demo-store.boroz.sa',
        email: 'merchant@boroz-demo.com',
        phone: '+966501234568',
        contactName: 'محمد أحمد',
        status: 'CLIENT',
      },
    });
    console.log(`✅ Demo merchant created`);

    // 8. Create Demo Lead
    console.log('👤 Creating demo lead...');
    await prisma.lead.create({
      data: {
        orgId: demoOrg.id,
        name: 'محمد احمد',
        email: 'lead@example.com',
        phone: '+966501234569',
        storeUrl: 'https://lead-store.boroz.sa',
        stage: 'NEW',
        source: 'WEBSITE',
      },
    });
    console.log(`✅ Demo lead created`);

    console.log('\n✨ Database seed completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: ChangeMe123!');
    console.log('\n🎯 Organization: BOROZ Demo');
    console.log('   Slug: boroz-demo');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
