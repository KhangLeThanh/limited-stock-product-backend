// src/routes/reserve.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const reserveSchema = z.object({
  productId: z.string(),
  userId: z.string(),
  quantity: z.number().min(1),
});

router.post("/", async (req, res) => {
  const parseResult = reserveSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.issues });
  }

  const { productId, userId, quantity } = parseResult.data;

  try {
    const reservation = await prisma.$transaction(async (tx: PrismaClient) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true, stock: true },
      });

      if (!product) throw new Error("Product not found");
      if (product.stock < quantity) throw new Error("Not enough stock");

      await tx.product.update({
        where: { id: productId },
        data: { stock: product.stock - quantity },
      });

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      return await tx.reservation.create({
        data: {
          productId,
          userId,
          quantity,
          expiresAt,
          status: "PENDING",
        },
      });
    });

    return res.status(201).json({
      reservationId: reservation.id,
      expiresAt: reservation.expiresAt,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
