// src/routes/orders.ts
import { Router } from "express";
import { PrismaClient, OrderStatus } from "@prisma/client";
import { SortField, SortOrder } from "../utils/enum";

const prisma = new PrismaClient();
export const orderRouter = Router();

orderRouter.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Filtering
    const filter: any = {};
    if (req.query.userId) filter.userId = req.query.userId as string;
    if (req.query.productId) filter.productId = req.query.productId as string;
    if (
      req.query.status &&
      Object.values(OrderStatus).includes(req.query.status as OrderStatus)
    ) {
      filter.status = req.query.status as OrderStatus;
    }

    // Sorting
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
      where: filter,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
    });

    const total = await prisma.order.count({ where: filter });

    res.json({ page, pageSize, total, orders });
  } catch (error) {
    next(error);
  }
});
