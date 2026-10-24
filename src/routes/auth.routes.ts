import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

export const authRouter = Router();
const controller = new AuthController();

authRouter.post("/login", controller.login);

authRouter.post("/registro", controller.registro);
authRouter.post("/registro/estudiante", controller.registroPorRol("ESTUDIANTE"));
authRouter.post("/registro/administrador", controller.registroPorRol("ADMIN"));
authRouter.post("/registro/donante", controller.registroPorRol("DONANTE"));
authRouter.post("/registro/tallerista", controller.registroPorRol("TALLERISTA"));
authRouter.post("/registro/acudiente", controller.registroPorRol("ACUDIENTE"));

authRouter.get("/perfil", controller.perfil);
authRouter.patch("/cambiar-contrasena", controller.cambiarContrasena);