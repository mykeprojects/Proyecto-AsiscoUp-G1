import { prisma } from "../prisma.js";
import type { SesionActualizar, SesionCrear } from "../types/crud.schemas.js";
import type { CrudRepository } from "../types/crud.js";

const sesionSegura = {
  id_sesion: true,
  id_usuario: true,
  fecha_hora_sesion: true,
  usuario: { select: { nombres: true, apellidos: true, correo_usuario: true } },
};

export const sesionRepository: CrudRepository<SesionCrear, SesionActualizar> = {
  listar: (skip, take) => prisma.sesion.findMany({
    skip, take, orderBy: { id_sesion: "asc" }, select: sesionSegura,
  }),
  buscarPorId: (id) => prisma.sesion.findUnique({ where: { id_sesion: id }, select: sesionSegura }),
  crear: (data) => prisma.sesion.create({ data, select: sesionSegura }),
  actualizar: (id, data) => prisma.sesion.update({ where: { id_sesion: id }, data, select: sesionSegura }),
  eliminar: async (id) => { await prisma.sesion.delete({ where: { id_sesion: id } }); },
};
