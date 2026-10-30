import { prisma } from "../prisma.js";
import type { RolUsuarioActualizar, RolUsuarioCrear } from "../types/crud.schemas.js";
import type { CrudRepository } from "../types/crud.js";

export const rolUsuarioRepository: CrudRepository<RolUsuarioCrear, RolUsuarioActualizar> = {
  listar: (skip, take) => prisma.rol_usuario.findMany({ skip, take, orderBy: { id_rol_usuario: "asc" } }),
  buscarPorId: (id) => prisma.rol_usuario.findUnique({ where: { id_rol_usuario: id } }),
  crear: (data) => prisma.rol_usuario.create({ data }),
  actualizar: (id, data) => prisma.rol_usuario.update({ where: { id_rol_usuario: id }, data }),
  eliminar: async (id) => { await prisma.rol_usuario.delete({ where: { id_rol_usuario: id } }); },
};
