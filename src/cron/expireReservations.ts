import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function expireReservations() {
  const expired = await prisma.reservation.findMany({
    where: {
      status: "PENDING",
      expiresAt: { lt: new Date() },
    },
  });

  for (const reservation of expired) {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: reservation.productId },
        data: { stock: { increment: reservation.quantity } },
      });

      await tx.reservation.update({
        where: { id: reservation.id },
        data: { status: "EXPIRED" },
      });

      await tx.inventoryLog.create({
        data: {
          productId: reservation.productId,
          quantity: reservation.quantity,
          type: "RESERVATION_EXPIRED",
        },
      });
    });
  }
}
