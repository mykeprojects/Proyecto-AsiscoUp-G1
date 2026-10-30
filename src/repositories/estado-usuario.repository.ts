import { prisma } from "../prisma.js";
import type { EstadoUsuarioActualizar, EstadoUsuarioCrear } from "../types/crud.schemas.js";
import type { CrudRepository } from "../types/crud.js";

export const estadoUsuarioRepository: CrudRepository<EstadoUsuarioCrear, EstadoUsuarioActualizar> = {
  listar: (skip, take) => prisma.estado_usuario.findMany({ skip, take, orderBy: { id_estado_usuario: "asc" } }),
  buscarPorId: (id) => prisma.estado_usuario.findUnique({ where: { id_estado_usuario: id } }),
  crear: (data) => prisma.estado_usuario.create({ data }),
  actualizar: (id, data) => prisma.estado_usuario.update({ where: { id_estado_usuario: id }, data }),
  eliminar: async (id) => { await prisma.estado_usuario.delete({ where: { id_estado_usuario: id } }); },
};
