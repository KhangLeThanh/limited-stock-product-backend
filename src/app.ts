import express from "express";
import reserveRouter from "./routes/reserve";
import checkoutRouter from "./routes/checkout";
import { expireReservations } from "./cron/expireReservations";
import { requestLogger, errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(express.json());
app.use(requestLogger);

app.use("/reserve", reserveRouter);
app.use("/checkout", checkoutRouter);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

setInterval(() => {
  expireReservations();
}, 60 * 1000);

app.listen(4000, () => console.log("Server running on port 4000"));
