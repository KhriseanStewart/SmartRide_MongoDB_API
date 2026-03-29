import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import env from "./config/env.js";
import userRoutes from "./routes/userRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import liveRoutes from "./routes/liveRoutes.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDb } from "./config/db.js";

const app = express();
const port = env.port || 4000

app.use(helmet());
app.use(cors({ origin: env.clientOrigin === "*" ? true : env.clientOrigin }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ success: true, message: "SmartRide API running" });
});

app.use("/api/users", userRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/live", liveRoutes);

app.use(notFound);
app.use(errorHandler);

// Only start listening when running as a standalone server (not on Vercel serverless)
if (!process.env.VERCEL) {
  connectDb()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((err) => {
      console.error("[MongoDB] Failed to connect:", err.message);
      if (err.code) console.error("[MongoDB] Code:", err.code);
      process.exit(1);
    });
}

export default app;
