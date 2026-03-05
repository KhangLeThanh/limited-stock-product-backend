import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const schema = z.object({
  userId: z.string(),
  productId: z.string(),
  quantity: z.number().min(1),
});

router.post("/", async (req, res, next) => {
  try {
    const { userId, productId, quantity } = schema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product || product.stock < quantity) {
        throw new Error("Not enough stock");
      }

      await tx.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
      });

      const reservation = await tx.reservation.create({
        data: {
          userId,
          productId,
          quantity,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      await tx.inventoryLog.create({
        data: {
          productId,
          quantity,
          type: "RESERVATION_CREATED",
        },
      });

      return reservation;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
