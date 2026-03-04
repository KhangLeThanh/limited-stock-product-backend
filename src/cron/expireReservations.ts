import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function expireReservations() {
  const now = new Date();

  try {
    const expiredReservations = await prisma.reservation.findMany({
      where: {
        status: "PENDING",
        expiresAt: { lte: now },
      },
    });

    if (expiredReservations.length === 0) return;

    for (const resv of expiredReservations) {
      await prisma.$transaction(async (tx: PrismaClient) => {
        await tx.product.update({
          where: { id: resv.productId },
          data: { stock: { increment: resv.quantity } },
        });

        await tx.reservation.update({
          where: { id: resv.id },
          data: { status: "EXPIRED" },
        });

        await tx.inventoryLog.create({
          data: {
            productId: resv.productId,
            quantity: resv.quantity,
            type: "RESERVATION_EXPIRED",
            description: `Reservation ${resv.id} expired`,
          },
        });
      });
    }

    console.log(`Expired ${expiredReservations.length} reservations`);
  } catch (err: any) {
    console.error("Error expiring reservations:", err.message);
  }
}
