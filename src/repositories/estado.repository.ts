import { prisma } from "../prisma.js";
import type { EstadoActualizar, EstadoCrear } from "../types/crud.schemas.js";
import type { CrudRepository } from "../types/crud.js";

export const estadoRepository: CrudRepository<EstadoCrear, EstadoActualizar> = {
  listar: (skip, take) => prisma.estado.findMany({ skip, take, orderBy: { id_estado: "asc" } }),
  buscarPorId: async (id) => {
    const estado = await prisma.estado.findUnique({
      where: { id_estado: id },
      include: {
        estado_usuario: {
          include: { usuario: { select: { id_usuario: true, nombres: true, apellidos: true, correo_usuario: true } } },
        },
      },
    });

    if (!estado) return null;

    const { estado_usuario, ...datosEstado } = estado;
    return { ...datosEstado, usuarios: estado_usuario.map(({ usuario }) => usuario) };
  },
  crear: (data) => prisma.estado.create({ data }),
  actualizar: (id, data) => prisma.estado.update({ where: { id_estado: id }, data }),
  eliminar: async (id) => { await prisma.estado.delete({ where: { id_estado: id } }); },
};
