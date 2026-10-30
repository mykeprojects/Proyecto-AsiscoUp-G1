export function getJwtSecret(): string {
  const secret = process.env["JWT_SECRET"];
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("JWT_SECRET debe tener al menos 32 bytes");
  }
  return secret;
}
