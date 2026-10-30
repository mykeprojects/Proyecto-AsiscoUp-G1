import { crearCrudService } from "./crud.service.js";
import { rolUsuarioRepository } from "../repositories/rol-usuario.repository.js";
import { rolUsuarioActualizarSchema, rolUsuarioCrearSchema } from "../types/crud.schemas.js";

export const rolUsuarioService = crearCrudService(rolUsuarioRepository, {
  crear: rolUsuarioCrearSchema,
  actualizar: rolUsuarioActualizarSchema,
});
