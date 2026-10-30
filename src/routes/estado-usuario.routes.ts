import { crearCrudRouter } from "./crud.routes.js";
import { estadoUsuarioService } from "../services/estado-usuario.service.js";

/**
 * @openapi
 * /api/estados-usuario:
 *   get:
 *     tags: [Estados de usuario]
 *     summary: Lista las asignaciones de estado a usuarios
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Listado paginado de asignaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EstadoUsuario'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     tags: [Estados de usuario]
 *     summary: Asigna un estado a un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EstadoUsuarioNuevo'
 *     responses:
 *       201:
 *         description: Estado asignado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadoUsuario'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 * /api/estados-usuario/{id}:
 *   get:
 *     tags: [Estados de usuario]
 *     summary: Consulta una asignación por ID
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Asignación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadoUsuario'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     tags: [Estados de usuario]
 *     summary: Actualiza una asignación por ID
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EstadoUsuarioActualizacion'
 *     responses:
 *       200:
 *         description: Asignación actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstadoUsuario'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     tags: [Estados de usuario]
 *     summary: Elimina una asignación por ID
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       204:
 *         description: Asignación eliminada
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const estadoUsuarioRouter = crearCrudRouter(estadoUsuarioService);
