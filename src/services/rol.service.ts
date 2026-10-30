import { crearCrudService } from "./crud.service.js";
import { rolRepository } from "../repositories/rol.repository.js";
import { rolActualizarSchema, rolCrearSchema } from "../types/crud.schemas.js";

export const rolService = crearCrudService(rolRepository, {
  crear: rolCrearSchema,
  actualizar: rolActualizarSchema,
});
