import express from "express";
import cors from "cors";
import reserveRouter from "./src/routes/reserve";
import checkoutRouter from "./src/routes/checkout";
import productsRouter from "./src/routes/products";
import { expireReservations } from "./src/cron/expireReservations";
import { requestLogger, errorHandler } from "./src/middleware/errorHandler";

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/reserve", reserveRouter);
app.use("/checkout", checkoutRouter);
app.use("/products", productsRouter);

// Health
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Run expiration cron every minute
setInterval(expireReservations, 60 * 1000);

// Error handling
app.use(errorHandler);

app.listen(process.env.PORT || 4000, () =>
  console.log("Server running on port 4000")
);
