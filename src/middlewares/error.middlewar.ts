import type { Request, Response, NextFunction } from "express";
import { AppError } from "../exceptions/app-exception.js";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. Errores de parseo o tamaño en el body enviado por el cliente
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ error: "El cuerpo de la petición contiene un JSON inválido" });
    return;
  }

  if (err?.type === "entity.too.large") {
    res.status(413).json({ error: "La petición excede el tamaño máximo permitido (16kb)" });
    return;
  }

  // 2. Excepciones personalizadas de la aplicación (BadRequestException, UnauthorizedException, etc.)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (typeof err === "object" && err !== null && "code" in err) {
    const code = err.code;
    if (code === "P2002") {
      res.status(409).json({ error: "Ya existe un registro con esos datos únicos" });
      return;
    }
    if (code === "P2025") {
      res.status(404).json({ error: "Recurso no encontrado" });
      return;
    }
    if (code === "P2003") {
      res.status(400).json({ error: "La referencia indicada no existe o no puede modificarse" });
      return;
    }
  }

  // 3. Fallos no controlados del sistema (500)
  console.error("Internal Error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
};