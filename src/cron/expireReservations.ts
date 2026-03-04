import {
  PrismaClient,
  ReservationStatus,
  InventoryLogType,
} from "@prisma/client";

const prisma = new PrismaClient();

export async function expireReservations(): Promise<void> {
  const now = new Date();

  try {
    const expiredReservations = await prisma.reservation.findMany({
      where: {
        status: ReservationStatus.PENDING,
        expiresAt: { lte: now },
      },
    });

    if (expiredReservations.length === 0) return;

    for (const resv of expiredReservations) {
      await prisma.$transaction(async (tx) => {
        await tx.product.update({
          where: { id: resv.productId },
          data: { stock: { increment: resv.quantity } },
        });

        await tx.reservation.update({
          where: { id: resv.id },
          data: { status: ReservationStatus.EXPIRED },
        });

        await tx.inventoryLog.create({
          data: {
            productId: resv.productId,
            quantity: resv.quantity,
            type: InventoryLogType.RESERVATION_EXPIRED,
            description: `Reservation ${resv.id} expired`,
          },
        });
      });
    }

    console.log(`[Cron] Expired ${expiredReservations.length} reservations`);
  } catch (error) {
    console.error(
      "[Cron] Error expiring reservations:",
      (error as Error).message
    );
  }
}
