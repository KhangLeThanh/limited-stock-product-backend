import { Router } from "express";
import {
  PrismaClient,
  ReservationStatus,
  InventoryLogType,
  OrderStatus,
} from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req, res, next) => {
  const { reservationId } = req.body as { reservationId: string };

  if (!reservationId)
    return res.status(400).json({ error: "reservationId is required" });

  try {
    const now = new Date();

    const order = await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) throw new Error("Reservation not found");
      if (reservation.status !== ReservationStatus.PENDING)
        throw new Error("Reservation cannot be checked out");
      if (reservation.expiresAt <= now)
        throw new Error("Reservation has expired");

      const createdOrder = await tx.order.create({
        data: {
          userId: reservation.userId,
          productId: reservation.productId,
          quantity: reservation.quantity,
          totalPrice: 0,
          status: OrderStatus.COMPLETED,
          reservationId: reservation.id,
        },
      });

      await tx.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.COMPLETED },
      });

      await tx.inventoryLog.create({
        data: {
          productId: reservation.productId,
          quantity: reservation.quantity,
          type: InventoryLogType.ORDER_CREATED,
          description: `Order ${createdOrder.id} created from reservation ${reservationId}`,
        },
      });

      return createdOrder;
    });

    res.status(201).json({ orderId: order.id });
  } catch (error) {
    next(error);
  }
});

export default router;
