import { Router } from "express";
import {
  PrismaClient,
  ReservationStatus,
  InventoryLogType,
} from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const reserveSchema = z.object({
  productId: z.string(),
  userId: z.string(),
  quantity: z.number().min(1),
});

router.post("/", async (req, res, next) => {
  try {
    const { productId, userId, quantity } = reserveSchema.parse(req.body);

    const reservation = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("Product not found");
      if (product.stock < quantity) throw new Error("Not enough stock");

      await tx.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
      });

      const newReservation = await tx.reservation.create({
        data: {
          productId,
          userId,
          quantity,
          status: ReservationStatus.PENDING,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      await tx.inventoryLog.create({
        data: {
          productId,
          quantity,
          type: InventoryLogType.RESERVATION_CREATED,
          description: `Reservation ${newReservation.id} created for user ${userId}`,
        },
      });

      return newReservation;
    });

    res.status(201).json({
      reservationId: reservation.id,
      expiresAt: reservation.expiresAt,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
