import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const schema = z.object({
  reservationId: z.string(),
});

router.post("/", async (req, res, next) => {
  try {
    const { reservationId } = schema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) throw new Error("Reservation not found");

      if (reservation.status !== "PENDING")
        throw new Error("Reservation not valid");

      const order = await tx.order.create({
        data: {
          userId: reservation.userId,
          productId: reservation.productId,
          quantity: reservation.quantity,
          reservationId: reservation.id,
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
        },
      });

      return order;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
