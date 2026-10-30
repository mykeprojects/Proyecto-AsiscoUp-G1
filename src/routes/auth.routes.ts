import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

export const authRouter = Router();
const controller = new AuthController();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Inicia sesión con correo y contraseña
 *     description: Devuelve un JWT válido durante dos horas.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
authRouter.post("/login", controller.login);

/**
 * @openapi
 * /api/auth/registro:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registra un usuario con un rol permitido
 *     description: No permite asignar el rol ADMIN desde esta ruta pública.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registro'
 *     responses:
 *       201:
 *         description: Usuario registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       413:
 *         description: El cuerpo de la solicitud supera 16 KB.
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
authRouter.post("/registro", controller.registro);
/**
 * @openapi
 * /api/auth/registro/estudiante:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registra un estudiante
 *     description: El rol se asigna como ESTUDIANTE; no se toma del body.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroPorRol'
 *     responses:
 *       201:
 *         description: Estudiante registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
authRouter.post("/registro/estudiante", controller.registroPorRol("ESTUDIANTE"));
/**
 * @openapi
 * /api/auth/registro/administrador:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registra un administrador
 *     description: Requiere un JWT de un usuario que ya tenga el rol ADMIN.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroPorRol'
 *     responses:
 *       201:
 *         description: Administrador registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
authRouter.post("/registro/administrador", requireAdmin, controller.registroPorRol("ADMIN"));
/**
 * @openapi
 * /api/auth/registro/donante:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registra un donante
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroPorRol'
 *     responses:
 *       201:
 *         description: Donante registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
authRouter.post("/registro/donante", controller.registroPorRol("DONANTE"));
/**
 * @openapi
 * /api/auth/registro/tallerista:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registra un tallerista
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroPorRol'
 *     responses:
 *       201:
 *         description: Tallerista registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
authRouter.post("/registro/tallerista", controller.registroPorRol("TALLERISTA"));
/**
 * @openapi
 * /api/auth/registro/acudiente:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registra un acudiente
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroPorRol'
 *     responses:
 *       201:
 *         description: Acudiente registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
authRouter.post("/registro/acudiente", controller.registroPorRol("ACUDIENTE"));

/**
 * @openapi
 * /api/auth/perfil:
 *   get:
 *     tags: [Autenticación]
 *     summary: Consulta el perfil del usuario autenticado
 *     responses:
 *       200:
 *         description: Perfil con los roles del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioPerfil'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
authRouter.get("/perfil", controller.perfil);
/**
 * @openapi
 * /api/auth/cambiar-contrasena:
 *   patch:
 *     tags: [Autenticación]
 *     summary: Cambia la contraseña del usuario autenticado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CambiarContrasena'
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensaje'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
authRouter.patch("/cambiar-contrasena", controller.cambiarContrasena);