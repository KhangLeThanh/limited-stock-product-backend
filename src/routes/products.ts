import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;

  const skip = (page - 1) * pageSize;

  const products = await prisma.product.findMany({
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.product.count();

  res.json({
    page,
    pageSize,
    total,
    products,
  });
});

export default router;
