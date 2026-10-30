import { prisma } from "../prisma.js";
import type { PermisoActualizar, PermisoCrear } from "../types/crud.schemas.js";
import type { CrudRepository } from "../types/crud.js";

export const permisoRepository: CrudRepository<PermisoCrear, PermisoActualizar> = {
  listar: (skip, take) => prisma.permiso.findMany({ skip, take, orderBy: { id_permiso: "asc" } }),
  buscarPorId: async (id) => {
    const permiso = await prisma.permiso.findUnique({
      where: { id_permiso: id },
      include: { permiso_rol: { include: { rol: true } } },
    });

    if (!permiso) return null;

    const { permiso_rol, ...datosPermiso } = permiso;
    return { ...datosPermiso, roles: permiso_rol.map(({ rol }) => rol) };
  },
  crear: (data) => prisma.permiso.create({ data }),
  actualizar: (id, data) => prisma.permiso.update({ where: { id_permiso: id }, data }),
  eliminar: async (id) => { await prisma.permiso.delete({ where: { id_permiso: id } }); },
};
