import { Router } from "express";
import {
  crearCrudController,
  crearCrudConsultaController,
  crearCrudListaPorRolController,
} from "../controllers/crud.controller.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";
import { usuarioService, usuarioConRolService } from "../services/usuario.service.js";

const usuarioController = crearCrudController(usuarioService);
const usuarioConRolController = crearCrudConsultaController(usuarioConRolService);
const usuarioPorRolController = crearCrudListaPorRolController(usuarioConRolService.listarPorRol);

export const usuarioRouter = Router();
usuarioRouter.use(requireAdmin);
/**
 * @openapi
 * /api/usuarios:
 *   get:
 *     tags: [Usuarios]
 *     summary: Lista los usuarios con sus roles
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
 * /api/usuarios/{rol}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Filtra usuarios por rol o consulta un usuario con sus roles por ID
 *     description: Un parámetro numérico consulta el usuario indicado; cualquier otro valor filtra por nombre de rol.
 *     parameters:
 *       - in: path
 *         name: rol
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del rol (por ejemplo, TALLERISTA) o ID numérico del usuario.
 *     responses:
 *       200:
 *         description: Lista paginada de usuarios con el rol indicado, o usuario encontrado con sus roles por ID numérico
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UsuarioConRoles'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *                 - $ref: '#/components/schemas/UsuarioConRoles'
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
 *       - in: path
 *         name: rol
 *         required: true
 *         schema:
 *           type: string
 *         description: ID numérico del usuario.
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
 *       - in: path
 *         name: rol
 *         required: true
 *         schema:
 *           type: string
 *         description: ID numérico del usuario.
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
usuarioRouter.get("/", usuarioController.listar);
usuarioRouter.get("/:rol", (req, res, next) => {
  if (/^\d+$/.test(req.params["rol"] ?? "")) {
    return usuarioConRolController.buscarPorId(req, res, next);
  }
  return usuarioPorRolController.listar(req, res, next);
});
usuarioRouter.post("/", usuarioController.crear);
usuarioRouter.put("/:id", usuarioController.actualizar);
usuarioRouter.delete("/:id", usuarioController.eliminar);
