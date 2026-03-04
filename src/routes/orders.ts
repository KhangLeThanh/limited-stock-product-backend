// src/routes/orders.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { SortField, SortOrder } from "../utils/enum";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const sortBy = Object.values(SortField).includes(
      req.query.sortBy as SortField
    )
      ? (req.query.sortBy as SortField)
      : SortField.CREATED_AT;

    const sortOrder = Object.values(SortOrder).includes(
      req.query.sortOrder as SortOrder
    )
      ? (req.query.sortOrder as SortOrder)
      : SortOrder.ASC;

    const orders = await prisma.order.findMany({
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
    });

    const total = await prisma.order.count();

    res.json({ page, pageSize, total, orders });
  } catch (error) {
    next(error);
  }
});

export default router;
