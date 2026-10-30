import { crearCrudRouter } from "./crud.routes.js";
import { permisoService } from "../services/permiso.service.js";

/**
 * @openapi
 * /api/permisos:
 *   get:
 *     tags: [Permisos]
 *     summary: Lista los permisos
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Listado paginado de permisos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Permiso'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     tags: [Permisos]
 *     summary: Crea un permiso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermisoNuevo'
 *     responses:
 *       201:
 *         description: Permiso creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permiso'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 * /api/permisos/{id}:
 *   get:
 *     tags: [Permisos]
 *     summary: Consulta un permiso por ID
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Permiso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permiso'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     tags: [Permisos]
 *     summary: Actualiza un permiso por ID
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermisoActualizacion'
 *     responses:
 *       200:
 *         description: Permiso actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permiso'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     tags: [Permisos]
 *     summary: Elimina un permiso por ID
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       204:
 *         description: Permiso eliminado
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const permisoRouter = crearCrudRouter(permisoService);
