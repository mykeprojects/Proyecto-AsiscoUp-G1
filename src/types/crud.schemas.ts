import { z } from "zod";

const id = z.number().int().positive();
const texto = z.string().trim().min(1);
const fecha = z.coerce.date();

type SinUndefined<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<T[K], undefined>;
} & {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

function omitirUndefined<T extends object>(value: T): SinUndefined<T> {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as SinUndefined<T>;
}

const estadoCampos = { descripcion: texto };
export const estadoCrearSchema = z.object(estadoCampos).strict().transform(omitirUndefined);
export const estadoActualizarSchema = z.object(estadoCampos).partial().strict()
  .refine((value) => Object.keys(value).length > 0, "Debe enviar al menos un campo")
  .transform(omitirUndefined);

const rolCampos = { nombre_rol: texto };
export const rolCrearSchema = z.object(rolCampos).strict().transform(omitirUndefined);
export const rolActualizarSchema = z.object(rolCampos).partial().strict()
  .refine((value) => Object.keys(value).length > 0, "Debe enviar al menos un campo")
  .transform(omitirUndefined);

const permisoCampos = { descripcion: texto };
export const permisoCrearSchema = z.object(permisoCampos).strict().transform(omitirUndefined);
export const permisoActualizarSchema = z.object(permisoCampos).partial().strict()
  .refine((value) => Object.keys(value).length > 0, "Debe enviar al menos un campo")
  .transform(omitirUndefined);

const usuarioCampos = {
  nombres: texto,
  apellidos: texto,
  tipo_documento: texto.nullable().optional(),
  numero_identificacion: texto,
  telefono: texto.nullable().optional(),
  direccion: texto.nullable().optional(),
  fecha_nacimiento: fecha.nullable().optional(),
  correo_usuario: z.string().trim().pipe(z.email()).transform((value) => value.toLowerCase()),
  contraseña_usuario: z.string().min(8),
  acepta_terminos_condiciones: z.boolean().optional(),
};
export const usuarioCrearSchema = z.object(usuarioCampos).strict().transform(omitirUndefined);
export const usuarioActualizarSchema = z.object({
  ...usuarioCampos,
  contraseña_usuario: z.string().min(8).optional(),
}).partial().strict().refine((value) => Object.keys(value).length > 0, "Debe enviar al menos un campo")
  .transform(omitirUndefined);

export const sesionCrearSchema = z.object({
  id_usuario: id,
  token_sesion: texto,
  fecha_hora_sesion: fecha.optional(),
}).strict().transform(omitirUndefined);
export const sesionActualizarSchema = z.object({
  id_usuario: id.optional(),
  token_sesion: texto.optional(),
  fecha_hora_sesion: fecha.optional(),
}).strict().refine((value) => Object.keys(value).length > 0, "Debe enviar al menos un campo")
  .transform(omitirUndefined);

export const estadoUsuarioCrearSchema = z.object({
  id_usuario: id,
  id_estado: id,
  fecha_estado_usuario: fecha.optional(),
}).strict().transform(omitirUndefined);
export const estadoUsuarioActualizarSchema = z.object({
  id_usuario: id.optional(),
  id_estado: id.optional(),
  fecha_estado_usuario: fecha.optional(),
}).strict().refine((value) => Object.keys(value).length > 0, "Debe enviar al menos un campo")
  .transform(omitirUndefined);

export const rolUsuarioCrearSchema = z.object({
  id_usuario: id,
  id_rol: id,
}).strict().transform(omitirUndefined);
export const rolUsuarioActualizarSchema = z.object({
  id_usuario: id.optional(),
  id_rol: id.optional(),
}).strict().refine((value) => Object.keys(value).length > 0, "Debe enviar al menos un campo")
  .transform(omitirUndefined);

export const permisoRolCrearSchema = z.object({
  id_rol: id,
  id_permiso: id,
}).strict().transform(omitirUndefined);
export const permisoRolActualizarSchema = z.object({
  id_rol: id.optional(),
  id_permiso: id.optional(),
}).strict().refine((value) => Object.keys(value).length > 0, "Debe enviar al menos un campo")
  .transform(omitirUndefined);

export type EstadoCrear = z.infer<typeof estadoCrearSchema>;
export type EstadoActualizar = z.infer<typeof estadoActualizarSchema>;
export type RolCrear = z.infer<typeof rolCrearSchema>;
export type RolActualizar = z.infer<typeof rolActualizarSchema>;
export type PermisoCrear = z.infer<typeof permisoCrearSchema>;
export type PermisoActualizar = z.infer<typeof permisoActualizarSchema>;
export type UsuarioCrear = z.infer<typeof usuarioCrearSchema>;
export type UsuarioActualizar = z.infer<typeof usuarioActualizarSchema>;
export type SesionCrear = z.infer<typeof sesionCrearSchema>;
export type SesionActualizar = z.infer<typeof sesionActualizarSchema>;
export type EstadoUsuarioCrear = z.infer<typeof estadoUsuarioCrearSchema>;
export type EstadoUsuarioActualizar = z.infer<typeof estadoUsuarioActualizarSchema>;
export type RolUsuarioCrear = z.infer<typeof rolUsuarioCrearSchema>;
export type RolUsuarioActualizar = z.infer<typeof rolUsuarioActualizarSchema>;
export type PermisoRolCrear = z.infer<typeof permisoRolCrearSchema>;
export type PermisoRolActualizar = z.infer<typeof permisoRolActualizarSchema>;
