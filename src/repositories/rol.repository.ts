import { prisma } from "../prisma.js";
import type { RolActualizar, RolCrear } from "../types/crud.schemas.js";
import type { CrudRepository } from "../types/crud.js";

export const rolRepository: CrudRepository<RolCrear, RolActualizar> = {
  listar: (skip, take) => prisma.rol.findMany({ skip, take, orderBy: { id_rol: "asc" } }),
  buscarPorId: async (id) => {
    const rol = await prisma.rol.findUnique({
      where: { id_rol: id },
      include: {
        rol_usuario: {
          include: { usuario: { select: { id_usuario: true, nombres: true, apellidos: true, correo_usuario: true } } },
        },
        permiso_rol: { include: { permiso: true } },
      },
    });

    if (!rol) return null;

    const { rol_usuario, permiso_rol, ...datosRol } = rol;
    return {
      ...datosRol,
      usuarios: rol_usuario.map(({ usuario }) => usuario),
      permisos: permiso_rol.map(({ permiso }) => permiso),
    };
  },
  crear: (data) => prisma.rol.create({ data }),
  actualizar: (id, data) => prisma.rol.update({ where: { id_rol: id }, data }),
  eliminar: async (id) => { await prisma.rol.delete({ where: { id_rol: id } }); },
};
