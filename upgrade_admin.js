const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.updateMany({
    where: { email: 'saleh.s.alsayed@hotmail.com' },
    data: { globalRole: 'ADMIN' }
  });
  console.log('Upgraded to admin:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
