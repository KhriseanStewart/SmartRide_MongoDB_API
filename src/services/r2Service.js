import { PutObjectCommand } from "@aws-sdk/client-s3";
import env from "../config/env.js";
import { getR2Client } from "../config/r2.js";

async function uploadProfileImage({ userId, buffer, contentType }) {
  const client = getR2Client();
  if (!client) {
    const err = new Error("Cloudflare R2 is not configured");
    err.statusCode = 500;
    throw err;
  }

  const key = `${userId}_${Date.now()}.jpg`;
  await client.send(
    new PutObjectCommand({
      Bucket: env.r2BucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType || "image/jpeg",
    })
  );

  if (!env.r2PublicBaseUrl) {
    const err = new Error("R2_PUBLIC_BASE_URL is required");
    err.statusCode = 500;
    throw err;
  }

  return `${env.r2PublicBaseUrl.replace(/\/$/, "")}/${key}`;
}

export { uploadProfileImage };
