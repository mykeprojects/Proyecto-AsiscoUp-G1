import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/jwt.js";
import { ForbiddenException, UnauthorizedException } from "../exceptions/app-exception.js";
import { prisma } from "../prisma.js";

export async function requireAdmin(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Se requiere un token Bearer");
    }

    const secret = getJwtSecret();
    let payload: string | jwt.JwtPayload;
    try {
      payload = jwt.verify(authorization.slice(7), secret);
    } catch {
      throw new UnauthorizedException("Token inválido o expirado");
    }
    if (typeof payload === "string" || typeof payload["id_usuario"] !== "number" ||
        !Number.isInteger(payload["id_usuario"])) {
      throw new UnauthorizedException("Token inválido");
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: payload["id_usuario"] },
      select: { rol_usuario: { select: { rol: { select: { nombre_rol: true } } } } },
    });
    if (!usuario?.rol_usuario.some(({ rol }) => rol.nombre_rol === "ADMIN")) {
      throw new ForbiddenException("Se requiere el rol ADMIN");
    }
    next();
  } catch (error) {
    next(error);
  }
}
