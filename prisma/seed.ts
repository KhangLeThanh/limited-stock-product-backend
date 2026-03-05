import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});
  await prisma.product.createMany({
    data: [
      { name: "Limited Sneaker", stock: 5 },
      { name: "Exclusive Hoodie", stock: 3 },
      { name: "Special Cap", stock: 10 },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
