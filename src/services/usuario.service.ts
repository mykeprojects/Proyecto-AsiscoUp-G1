import bcrypt from "bcryptjs";
import { NotFoundException } from "../exceptions/app-exception.js";
import {
  buscarUsuarioConRol,
  listarUsuariosConRol,
  usuarioRepository,
} from "../repositories/usuario.repository.js";
import { crearCrudService } from "./crud.service.js";
import { usuarioActualizarSchema, usuarioCrearSchema } from "../types/crud.schemas.js";

export const usuarioService = crearCrudService(usuarioRepository, {
  crear: usuarioCrearSchema,
  actualizar: usuarioActualizarSchema,
}, {
  crear: async (data) => ({
    ...data,
    contraseña_usuario: await bcrypt.hash(data.contraseña_usuario, 10),
  }),
  actualizar: async (data) => ({
    ...data,
    ...(data.contraseña_usuario
      ? { contraseña_usuario: await bcrypt.hash(data.contraseña_usuario, 10) }
      : {}),
  }),
});

export const usuarioConRolService = {
  listar: listarUsuariosConRol,
  buscarPorId: async (id: number) => {
    const usuario = await buscarUsuarioConRol(id);
    if (!usuario) throw new NotFoundException("Recurso no encontrado");
    return usuario;
  },
};
