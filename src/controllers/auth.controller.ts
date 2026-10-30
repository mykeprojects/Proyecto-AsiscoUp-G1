import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "../services/auth.service.js";
import { UnauthorizedException } from "../exceptions/app-exception.js";
import { getJwtSecret } from "../config/jwt.js";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  private obtenerIdUsuarioToken(req: Request): number {
    const token = req.headers.authorization?.replace("Bearer ", "") ?? "";
    const secret = getJwtSecret();
    try {
      const decoded = jwt.verify(token, secret);
      if (typeof decoded === "string" || typeof decoded["id_usuario"] !== "number" ||
          !Number.isInteger(decoded["id_usuario"])) throw new Error("ID inválido");
      return decoded.id_usuario;
    } catch {
      throw new UnauthorizedException("Token inválido o expirado");
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resultado = await this.authService.login(req.body);
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  };

  registro = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuario = await this.authService.registrar(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  registroPorRol = (rol: string) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuario = await this.authService.registrar({ ...req.body, rol }, rol === "ADMIN");
      res.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  perfil = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id_usuario = this.obtenerIdUsuarioToken(req);
      const perfil = await this.authService.obtenerPerfil(id_usuario);
      res.json(perfil);
    } catch (error) {
      next(error);
    }
  };

  cambiarContrasena = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id_usuario = this.obtenerIdUsuarioToken(req);
      const resultado = await this.authService.cambiarContrasena(id_usuario, req.body);
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  };
}