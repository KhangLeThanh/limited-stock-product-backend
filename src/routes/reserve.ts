// src/routes/reserve.ts
import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const reserveRouter = Router();

reserveRouter.post("/", authenticate, async (req: any, res) => {
  const userId = req.userId;
  const { productId, quantity } = req.body;

  if (!productId || !quantity)
    return res.status(400).json({ message: "ProductId and quantity required" });

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity)
      return res.status(400).json({ message: "Not enough stock" });

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    const reservation = await prisma.reservation.create({
      data: { userId, productId, quantity, expiresAt },
    });

    return res.json(reservation);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Reservation failed" });
  }
});
