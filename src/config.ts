import "dotenv/config";

export function readPublicUrl(
  env: NodeJS.ProcessEnv = process.env,
  fallbackPort = Number(env["PORT"] ?? 3000),
): string {
  const configuredUrl = env["PUBLIC_URL"]?.trim();
  if (!configuredUrl) {
    if (env["NODE_ENV"] === "production") {
      throw new Error("PUBLIC_URL es obligatorio en producción");
    }
    if (!Number.isInteger(fallbackPort) || fallbackPort < 1 || fallbackPort > 65535) {
      throw new Error("PORT debe estar entre 1 y 65535");
    }
    return `http://localhost:${fallbackPort}`;
  }

  let url: URL;
  try {
    url = new URL(configuredUrl);
  } catch {
    throw new Error("PUBLIC_URL no es una URL válida");
  }
  if (!["http:", "https:"].includes(url.protocol) || !url.hostname ||
      url.username || url.password || url.search || url.hash) {
    throw new Error("PUBLIC_URL debe ser una URL HTTP(S) pública sin credenciales ni parámetros");
  }
  if (env["NODE_ENV"] === "production" && url.protocol !== "https:") {
    throw new Error("PUBLIC_URL debe usar HTTPS en producción");
  }
  return url.toString().replace(/\/+$/, "");
}

export function readConfig(env: NodeJS.ProcessEnv = process.env) {
  const value = env["DATABASE_URL"];
  if (!value) throw new Error("Falta DATABASE_URL en el archivo .env");
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("DATABASE_URL no es una URL válida");
  }
  if (!["postgres:", "postgresql:"].includes(url.protocol) || !url.hostname || !url.username || url.pathname.length < 2) {
    throw new Error("DATABASE_URL debe contener una conexión PostgreSQL");
  }
  if (url.hostname.includes("oovoswegjrisiqhumkya") || decodeURIComponent(url.username).endsWith(".oovoswegjrisiqhumkya")) {
    throw new Error("La conexión corresponde al grupo 2; configure la base independiente del grupo 1");
  }
  const port = Number(env["PORT"] ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT debe estar entre 1 y 65535");
  readPublicUrl(env, port);
  const jwtSecret = env["JWT_SECRET"];
  if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) throw new Error("JWT_SECRET debe tener al menos 32 bytes");
  return { jwtSecret, databaseUrl: value, port, host: env["HOST"] ?? "0.0.0.0" };
}
