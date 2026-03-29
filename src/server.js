import app from "./app.js";
import env from "./config/env.js";
import { connectDb } from "./config/db.js";

async function bootstrap() {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`SmartRide API listening on :${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to boot server:", err.message);
  process.exit(1);
});
