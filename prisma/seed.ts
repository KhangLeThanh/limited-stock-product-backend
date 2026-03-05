import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.reservation.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.product.createMany({
    data: [
      { name: "Limited Sneaker", stock: 5 },
      { name: "Exclusive Hoodie", stock: 3 },
      { name: "Special Cap", stock: 10 },
    ],
  });

  await prisma.user.createMany({
    data: [
      { id: "user1", name: "User 1", email: "user1@test.com" },
      { id: "user2", name: "User 2", email: "user2@test.com" },
      { id: "user3", name: "User 3", email: "user3@test.com" },
      { id: "user4", name: "User 4", email: "user4@test.com" },
      { id: "user5", name: "User 5", email: "user5@test.com" },
    ],
  });

  console.log("Seed complete");
}

main().finally(() => prisma.$disconnect());
