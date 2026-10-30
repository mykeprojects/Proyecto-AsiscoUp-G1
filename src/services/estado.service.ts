import { crearCrudService } from "./crud.service.js";
import { estadoRepository } from "../repositories/estado.repository.js";
import { estadoActualizarSchema, estadoCrearSchema } from "../types/crud.schemas.js";

export const estadoService = crearCrudService(estadoRepository, {
  crear: estadoCrearSchema,
  actualizar: estadoActualizarSchema,
});
