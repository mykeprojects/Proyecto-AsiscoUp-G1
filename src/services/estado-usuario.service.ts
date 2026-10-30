import { crearCrudService } from "./crud.service.js";
import { estadoUsuarioRepository } from "../repositories/estado-usuario.repository.js";
import { estadoUsuarioActualizarSchema, estadoUsuarioCrearSchema } from "../types/crud.schemas.js";

export const estadoUsuarioService = crearCrudService(estadoUsuarioRepository, {
  crear: estadoUsuarioCrearSchema,
  actualizar: estadoUsuarioActualizarSchema,
});
