// src/routes/checkout.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/authenticate";

const prisma = new PrismaClient();
export const checkoutRouter = Router();

checkoutRouter.post("/", authenticate, async (req: any, res) => {
  const { reservationId } = req.body;

  if (!reservationId) {
    return res.status(400).json({ message: "reservationId required" });
  }

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status !== "PENDING") {
      return res.status(400).json({ message: "Reservation already processed" });
    }

    if (new Date(reservation.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Reservation expired" });
    }

    // 🔹 decrease stock
    await prisma.product.update({
      where: { id: reservation.productId },
      data: {
        stock: {
          decrement: reservation.quantity,
        },
      },
    });

    // 🔹 mark reservation completed
    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "COMPLETED" },
    });

    return res.json({ message: "Checkout successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Checkout failed" });
  }
});
