import app from "../src/app.js";
import { connectDb } from "../src/config/db.js";

export default async function handler(req, res) {
  try {
    await connectDb();
    return app(req, res);
  } catch (err) {
    console.error("[MongoDB] Handler connection error:", err.message);
    if (!res.headersSent) {
      res.status(503).json({ success: false, message: "Database unavailable", error: err.message });
    }
    return Promise.resolve();
  }
}
