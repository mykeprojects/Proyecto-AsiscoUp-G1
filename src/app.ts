import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes.js";
import { estadoRouter } from "./routes/estado.routes.js";
import { rolRouter } from "./routes/rol.routes.js";
import { permisoRouter } from "./routes/permiso.routes.js";
import { usuarioRouter } from "./routes/usuario.routes.js";
import { sesionRouter } from "./routes/sesion.routes.js";
import { estadoUsuarioRouter } from "./routes/estado-usuario.routes.js";
import { rolUsuarioRouter } from "./routes/rol-usuario.routes.js";
import { permisoRolRouter } from "./routes/permiso-rol.routes.js";
import { errorHandler } from "./middlewares/error.middlewar.js";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

export const app = express();

// Ocultar cabeceras por seguridad
app.disable("x-powered-by");

// Middlewares globales
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
app.use(cors());
app.use(express.json({ limit: "16kb" }));

/**
 * @openapi
 * /:
 *   get:
 *     tags: [Sistema]
 *     summary: Información básica del servicio
 *     security: []
 *     responses:
 *       200:
 *         description: API disponible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, service, docs, health]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 service:
 *                   type: string
 *                   example: AsiscoUp API
 *                 docs:
 *                   type: string
 *                   example: /api-docs
 *                 health:
 *                   type: string
 *                   example: /health
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "AsiscoUp API",
    docs: "/api-docs",
    health: "/health",
  });
});

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Sistema]
 *     summary: Verifica que la aplicación está respondiendo
 *     security: []
 *     responses:
 *       200:
 *         description: Aplicación disponible
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Health'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

const serveOpenApiSpec = (_req: express.Request, res: express.Response): void => {
  res.setHeader("Cache-Control", "no-cache");
  res.json(swaggerSpec);
};
app.get("/api-docs.json", serveOpenApiSpec);
app.get("/api-docs/openapi.json", serveOpenApiSpec);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Documentación API AsiscoUp",
    customCss: `
      .swagger-ui .topbar { background-color: #17324d; }
      .swagger-ui .info .title { color: #17324d; }
      .swagger-ui .btn.authorize { border-color: #287c61; color: #287c61; }
    `,
    swaggerOptions: {
      persistAuthorization: false,
      displayRequestDuration: true,
      deepLinking: true,
      docExpansion: "none",
      filter: true,
      validatorUrl: null,
    },
  }),
);

// Montaje de enrutadores modulares
app.use("/api/auth", authRouter);
app.use("/api/estados", estadoRouter);
app.use("/api/roles", rolRouter);
app.use("/api/permisos", permisoRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/sesiones", sesionRouter);
app.use("/api/estados-usuario", estadoUsuarioRouter);
app.use("/api/roles-usuario", rolUsuarioRouter);
app.use("/api/permisos-rol", permisoRolRouter);

// Manejador para rutas no encontradas (404)
app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware centralizado de errores (Debe registrarse al final)
app.use(errorHandler);