import express from "express";
import cors from "cors";

import authRouter from "./routes/auth";
import reserveRouter from "./routes/reserve";
import checkoutRouter from "./routes/checkout";
import productRouter from "./routes/products";
import orderRouter from "./routes/orders";

import { expireReservations } from "./cron/expireReservations";
import { requestLogger, errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/login", authRouter);
app.use("/products", productRouter);
app.use("/reserve", reserveRouter);
app.use("/checkout", checkoutRouter);
app.use("/orders", orderRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/metrics", (_req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

setInterval(() => {
  expireReservations();
}, 60000);

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
