import dotenv from "dotenv";

dotenv.config();

const env = {
  port: Number(process.env.PORT || 8080),
  mongoUri: process.env.MONGO_URI || "",
  clientOrigin: process.env.CLIENT_ORIGIN || "*",
  adminToken: process.env.ADMIN_TOKEN || process.env.adminToken || "",
  driverInvitePassword: process.env.DRIVER_INVITE_PASSWORD || "reset123",
  r2AccountId: process.env.R2_ACCOUNT_ID || "",
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID || "",
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  r2BucketName: process.env.R2_BUCKET_NAME || "user_profile",
  r2PublicBaseUrl: process.env.R2_PUBLIC_BASE_URL || "",
};

export default env;
