import crypto from "crypto";

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return {
    salt,
    passwordHash,
  };
}

function verifyPassword(password, salt, passwordHash) {
  const candidateHash = crypto.scryptSync(password, salt, 64);
  const storedHash = Buffer.from(passwordHash, "hex");

  if (candidateHash.length !== storedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(candidateHash, storedHash);
}

export { hashPassword, verifyPassword };
