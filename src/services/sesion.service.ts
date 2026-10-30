import { crearCrudService } from "./crud.service.js";
import { sesionRepository } from "../repositories/sesion.repository.js";
import { sesionActualizarSchema, sesionCrearSchema } from "../types/crud.schemas.js";

export const sesionService = crearCrudService(sesionRepository, {
  crear: sesionCrearSchema,
  actualizar: sesionActualizarSchema,
});
