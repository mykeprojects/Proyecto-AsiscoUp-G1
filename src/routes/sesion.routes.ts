import { crearCrudRouter } from "./crud.routes.js";
import { sesionService } from "../services/sesion.service.js";

/**
 * @openapi
 * /api/sesiones:
 *   get:
 *     tags: [Sesiones]
 *     summary: Lista las sesiones
 *     description: Los tokens de sesión no se exponen en las respuestas.
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Listado paginado de sesiones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sesion'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     tags: [Sesiones]
 *     summary: Crea una sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SesionNueva'
 *     responses:
 *       201:
 *         description: Sesión creada, sin exponer el token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sesion'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 * /api/sesiones/{id}:
 *   get:
 *     tags: [Sesiones]
 *     summary: Consulta una sesión por ID
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Sesión encontrada, sin exponer el token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sesion'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     tags: [Sesiones]
 *     summary: Actualiza una sesión por ID
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SesionActualizacion'
 *     responses:
 *       200:
 *         description: Sesión actualizada, sin exponer el token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sesion'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     tags: [Sesiones]
 *     summary: Elimina una sesión por ID
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       204:
 *         description: Sesión eliminada
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const sesionRouter = crearCrudRouter(sesionService);
