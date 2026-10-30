import { Router } from "express";
import { crearCrudController, crearCrudConsultaController } from "../controllers/crud.controller.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";
import { usuarioService, usuarioConRolService } from "../services/usuario.service.js";

const usuarioController = crearCrudController(usuarioService);
const usuarioConRolController = crearCrudConsultaController(usuarioConRolService);

export const usuarioRouter = Router();
usuarioRouter.use(requireAdmin);
/**
 * @openapi
 * /api/usuarios/con-rol:
 *   get:
 *     tags: [Usuarios]
 *     summary: Lista usuarios con sus roles
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Listado paginado de usuarios con sus roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UsuarioConRoles'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
usuarioRouter.get("/con-rol", usuarioConRolController.listar);
/**
 * @openapi
 * /api/usuarios/con-rol/{id}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Consulta un usuario con sus roles por ID
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Usuario con sus roles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioConRoles'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 * /api/usuarios:
 *   get:
 *     tags: [Usuarios]
 *     summary: Lista los usuarios sin exponer contraseñas
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Listado paginado de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     tags: [Usuarios]
 *     summary: Crea un usuario
 *     description: La contraseña se almacena cifrada y no se devuelve.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioNuevo'
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 * /api/usuarios/{id}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Consulta un usuario por ID sin exponer contraseña
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualiza un usuario por ID
 *     description: Si se envía una contraseña, se almacena cifrada.
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioActualizacion'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
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
 *   delete:
 *     tags: [Usuarios]
 *     summary: Elimina un usuario por ID
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       204:
 *         description: Usuario eliminado
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
usuarioRouter.get("/con-rol/:id", usuarioConRolController.buscarPorId);
usuarioRouter.get("/", usuarioController.listar);
usuarioRouter.get("/:id", usuarioController.buscarPorId);
usuarioRouter.post("/", usuarioController.crear);
usuarioRouter.put("/:id", usuarioController.actualizar);
usuarioRouter.delete("/:id", usuarioController.eliminar);
