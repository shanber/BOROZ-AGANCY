import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../app/lib/auth';

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
        password: await hashPassword('ChangeMe123!'),
        phone: '+966501234567',
        isActive: true,
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

    // 6. Create BOROZ Services (10 Services)
    console.log('🛠️ Creating BOROZ services...');
    const services = [
      {
        name: 'تخصيص متجر سلة',
        basePrice: 2500,
        estimatedDays: 10,
      },
      {
        name: 'إدارة المتجر',
        basePrice: 0,
        estimatedDays: -1,
      },
      {
        name: 'تصميم واجهات المتجر',
        basePrice: 3000,
        estimatedDays: 14,
      },
      {
        name: 'تطوير وتحسين المتجر',
        basePrice: 5000,
        estimatedDays: 30,
      },
      {
        name: 'تصميم البنرات',
        basePrice: 1500,
        estimatedDays: 7,
      },
      {
        name: 'تصميم الهوية البصرية',
        basePrice: 3000,
        estimatedDays: 14,
      },
      {
        name: 'إدارة الحملات الإعلانية',
        basePrice: 4000,
        estimatedDays: 30,
      },
      {
        name: 'كتابة المحتوى التسويقي',
        basePrice: 2000,
        estimatedDays: 14,
      },
      {
        name: 'إنشاء صفحات الهبوط',
        basePrice: 2500,
        estimatedDays: 7,
      },
      {
        name: 'تحسين SEO للمتجر',
        basePrice: 3500,
        estimatedDays: 45,
      },
    ];

    for (const service of services) {
      await prisma.service.upsert({
        where: { name: service.name },
        update: {},
        create: {
          name: service.name,
          basePrice: service.basePrice,
          estimatedDays: service.estimatedDays,
          isActive: true,
        },
      });
    }
    console.log(`✅ Created ${services.length} services`);

    // 7. Create Demo Merchant
    console.log('🏪 Creating demo merchant...');
    await prisma.merchant.create({
      data: {
        orgId: demoOrg.id,
        storeName: 'متجر تجريبي بروز',
        email: 'merchant@boroz-demo.com',
        phone: '+966501234568',
        sallaStoreId: 'demo-store-123',
        status: 'ACTIVE',
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
        stage: 'INTERESTED',
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
