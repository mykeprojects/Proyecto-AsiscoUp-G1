import { crearCrudService } from "./crud.service.js";
import { permisoRepository } from "../repositories/permiso.repository.js";
import { permisoActualizarSchema, permisoCrearSchema } from "../types/crud.schemas.js";

export const permisoService = crearCrudService(permisoRepository, {
  crear: permisoCrearSchema,
  actualizar: permisoActualizarSchema,
});
