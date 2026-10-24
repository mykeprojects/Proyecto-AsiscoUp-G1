import { prisma } from "../prisma.js";
import { NotFoundException } from "../exceptions/app-exception.js";
import type { RegistroDTO } from "../types/auth.types.js";


export class UserRepository {
  async buscarPorCorreo(correo_usuario: string) {
    return await prisma.usuario.findUnique({
      where: { correo_usuario },
      include: {
        rol_usuario: {
          select: { rol: { select: { nombre_rol: true } } },
        },
      },
    });
  }

  async buscarPorNumeroIdentificacion(numero_identificacion: string) {
    return await prisma.usuario.findUnique({ where: { numero_identificacion } });
  }

  async buscarPorId(id_usuario: number) {
    return await prisma.usuario.findUnique({
      where: { id_usuario },
      select: {
        id_usuario: true,
        correo_usuario: true,
        nombres: true,
        apellidos: true,
        tipo_documento: true,
        numero_identificacion: true,
        telefono: true,
        direccion: true,
        fecha_nacimiento: true,
        acepta_terminos_condiciones: true,
        creado_en: true,
        rol_usuario: {
          select: { rol: { select: { nombre_rol: true } } },
        },
      },
    });
  }

  async crearConRol(dto: RegistroDTO, claveCifrada: string) {
    return await prisma.$transaction(async (tx) => {
      const rol = await tx.rol.findUnique({ where: { nombre_rol: dto.rol.trim() } });
      if (!rol) {
        throw new NotFoundException(`El rol ${dto.rol} no está configurado`);
      }

      const nuevoUsuario = await tx.usuario.create({
        data: {
          correo_usuario: dto.correo_usuario,
          nombres: dto.nombres,
          apellidos: dto.apellidos,
          ...(dto.tipo_documento ? { tipo_documento: dto.tipo_documento } : {}),
          numero_identificacion: dto.numero_identificacion,
          ...(dto.telefono ? { telefono: dto.telefono } : {}),
          ...(dto.direccion ? { direccion: dto.direccion } : {}),
          ...(dto.fecha_nacimiento ? { fecha_nacimiento: new Date(dto.fecha_nacimiento) } : {}),
          contraseña_usuario: claveCifrada,
          acepta_terminos_condiciones: Boolean(dto.acepta_terminos_condiciones),
        },
      });

      await tx.rol_usuario.create({
        data: {
          id_usuario: nuevoUsuario.id_usuario,
          id_rol: rol.id_rol,
        },
      });

      return {
        id_usuario: nuevoUsuario.id_usuario,
        correo_usuario: nuevoUsuario.correo_usuario,
        nombres: nuevoUsuario.nombres,
        apellidos: nuevoUsuario.apellidos,
        numero_identificacion: nuevoUsuario.numero_identificacion,
        rol: rol.nombre_rol,
        creado_en: nuevoUsuario.creado_en,
      };
    });
  }

  async actualizarContrasena(id_usuario: number, nuevaClaveCifrada: string) {
    return await prisma.usuario.update({
      where: { id_usuario },
      data: { contraseña_usuario: nuevaClaveCifrada },
    });
  }
}