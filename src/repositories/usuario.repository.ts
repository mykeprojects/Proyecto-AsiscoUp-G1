import { prisma } from "../prisma.js";
import type { UsuarioActualizar, UsuarioCrear } from "../types/crud.schemas.js";
import type { CrudRepository } from "../types/crud.js";

const usuarioSeguro = {
  id_usuario: true,
  nombres: true,
  apellidos: true,
  tipo_documento: true,
  numero_identificacion: true,
  telefono: true,
  direccion: true,
  fecha_nacimiento: true,
  correo_usuario: true,
  acepta_terminos_condiciones: true,
  creado_en: true,
};

const usuarioListado = {
  id_usuario: true,
  nombres: true,
  apellidos: true,
  correo_usuario: true,
};

function simplificarRoles<T extends {
  rol_usuario: { rol: { id_rol: number; nombre_rol: string } }[];
}>(usuario: T) {
  const { rol_usuario, ...datosUsuario } = usuario;
  return { ...datosUsuario, roles: rol_usuario.map(({ rol }) => rol) };
}

export async function listarUsuariosConRol(skip: number, take: number) {
  const usuarios = await prisma.usuario.findMany({
    skip,
    take,
    orderBy: { id_usuario: "asc" },
    select: {
      ...usuarioListado,
      rol_usuario: {
        select: { rol: { select: { id_rol: true, nombre_rol: true } } },
      },
    },
  });
  return usuarios.map(simplificarRoles);
}

export async function buscarUsuarioConRol(id: number) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id },
    select: {
      ...usuarioSeguro,
      rol_usuario: {
        select: { rol: { select: { id_rol: true, nombre_rol: true } } },
      },
    },
  });
  return usuario ? simplificarRoles(usuario) : null;
}

export const usuarioRepository: CrudRepository<UsuarioCrear, UsuarioActualizar> = {
  listar: (skip, take) => prisma.usuario.findMany({
    skip,
    take,
    orderBy: { id_usuario: "asc" },
    select: usuarioListado,
  }),
  buscarPorId: (id) => prisma.usuario.findUnique({ where: { id_usuario: id }, select: usuarioSeguro }),
  crear: (data) => prisma.usuario.create({ data, select: usuarioSeguro }),
  actualizar: (id, data) => prisma.usuario.update({ where: { id_usuario: id }, data, select: usuarioSeguro }),
  eliminar: async (id) => { await prisma.usuario.delete({ where: { id_usuario: id } }); },
};
