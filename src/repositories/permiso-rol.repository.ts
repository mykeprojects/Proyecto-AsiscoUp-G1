import { prisma } from "../prisma.js";
import type { PermisoRolActualizar, PermisoRolCrear } from "../types/crud.schemas.js";
import type { CrudRepository } from "../types/crud.js";

export const permisoRolRepository: CrudRepository<PermisoRolCrear, PermisoRolActualizar> = {
  listar: (skip, take) => prisma.permiso_rol.findMany({ skip, take, orderBy: { id_permiso_rol: "asc" } }),
  buscarPorId: (id) => prisma.permiso_rol.findUnique({ where: { id_permiso_rol: id } }),
  crear: (data) => prisma.permiso_rol.create({ data }),
  actualizar: (id, data) => prisma.permiso_rol.update({ where: { id_permiso_rol: id }, data }),
  eliminar: async (id) => { await prisma.permiso_rol.delete({ where: { id_permiso_rol: id } }); },
};
