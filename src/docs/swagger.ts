import "dotenv/config";
import swaggerJSDoc from "swagger-jsdoc";
import { readPublicUrl } from "../config.js";

export function getSwaggerServers(env: NodeJS.ProcessEnv = process.env) {
  const port = Number(env["PORT"] ?? 3000);
  const localServer = {
    url: readPublicUrl({}, port),
    description: "Desarrollo local",
  };
  const configuredPublicUrl = env["PUBLIC_URL"]?.trim();

  if (env["NODE_ENV"] === "production") {
    return [{ url: readPublicUrl(env, port), description: "Producción" }];
  }
  if (configuredPublicUrl) {
    return [
      { url: readPublicUrl(env, port), description: "Producción" },
      localServer,
    ];
  }
  return [localServer];
}

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API AsiscoUp",
      version: "1.0.0",
      description: [
        "API REST para la gestión de usuarios, roles, permisos y estados de AsiscoUp.",
        "Las operaciones CRUD administrativas requieren un usuario con rol ADMIN.",
      ].join("\n\n"),
    },
    servers: getSwaggerServers(),
    tags: [
      { name: "Sistema", description: "Disponibilidad del servicio." },
      { name: "Autenticación", description: "Registro, inicio de sesión y perfil." },
      { name: "Estados", description: "Estados del sistema." },
      { name: "Roles", description: "Roles de usuario." },
      { name: "Permisos", description: "Permisos disponibles." },
      { name: "Usuarios", description: "Gestión de usuarios." },
      { name: "Sesiones", description: "Sesiones asociadas a usuarios." },
      { name: "Estados de usuario", description: "Asignación de estados a usuarios." },
      { name: "Roles de usuario", description: "Asignación de roles a usuarios." },
      { name: "Permisos de rol", description: "Asignación de permisos a roles." },
    ],
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/app.ts", "./src/routes/*.ts", "./src/docs/*.yaml"],
});
