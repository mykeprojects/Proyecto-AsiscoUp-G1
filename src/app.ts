import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middlewar.js";

export const app = express();

// Ocultar cabeceras por seguridad
app.disable("x-powered-by");

// Middlewares globales
app.use(cors());
app.use(express.json({ limit: "16kb" }));

// Montaje de enrutadores modulares
app.use("/api/auth", authRouter);

// Manejador para rutas no encontradas (404)
app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware centralizado de errores (Debe registrarse al final)
app.use(errorHandler);