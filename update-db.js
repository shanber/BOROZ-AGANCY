const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.service.deleteMany({
    where: { slug: 'presentation-design' }
  });
  console.log('Deleted presentation-design');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
