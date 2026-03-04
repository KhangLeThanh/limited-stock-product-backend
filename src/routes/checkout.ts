import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req, res) => {
  const { reservationId } = req.body;

  if (!reservationId) {
    return res.status(400).json({ error: "reservationId is required" });
  }

  try {
    const now = new Date();

    const order = await prisma.$transaction(async (tx: PrismaClient) => {
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) throw new Error("Reservation not found");
      if (reservation.status !== "PENDING")
        throw new Error("Reservation cannot be checked out");
      if (reservation.expiresAt <= now)
        throw new Error("Reservation has expired");

      const createdOrder = await tx.order.create({
        data: {
          userId: reservation.userId,
          productId: reservation.productId,
          quantity: reservation.quantity,
          totalPrice: 0,
        },
      });

      await tx.reservation.update({
        where: { id: reservationId },
        data: { status: "COMPLETED" },
      });

      await tx.inventoryLog.create({
        data: {
          productId: reservation.productId,
          quantity: reservation.quantity,
          type: "ORDER_CREATED",
          description: `Order ${createdOrder.id} created from reservation ${reservationId}`,
        },
      });

      return createdOrder;
    });

    return res.status(201).json({ orderId: order.id });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
