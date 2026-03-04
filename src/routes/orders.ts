import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Sorting
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as string) === "desc" ? "desc" : "asc";

    // Filtering (optional)
    const status = req.query.status as string | undefined;

    const where: any = {};
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      skip,
      take,
      where,
      orderBy: { [sortBy]: sortOrder },
    });

    // Total count for frontend pagination
    const total = await prisma.order.count({ where });

    res.json({
      page,
      pageSize,
      total,
      orders,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
