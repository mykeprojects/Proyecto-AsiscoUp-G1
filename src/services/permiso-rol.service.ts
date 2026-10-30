import { crearCrudService } from "./crud.service.js";
import { permisoRolRepository } from "../repositories/permiso-rol.repository.js";
import { permisoRolActualizarSchema, permisoRolCrearSchema } from "../types/crud.schemas.js";

export const permisoRolService = crearCrudService(permisoRolRepository, {
  crear: permisoRolCrearSchema,
  actualizar: permisoRolActualizarSchema,
});
