export interface RegistroDTO {
  nombres: string;
  apellidos: string;
  tipo_documento?: string;
  numero_identificacion: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  correo_usuario: string;
  contraseña_usuario: string;
  acepta_terminos_condiciones?: boolean;
  rol: string;
}

export interface LoginDTO {
  correo_usuario: string;
  contraseña_usuario: string;
}

export interface CambiarContrasenaDTO {
  contraseña_actual: string;
  nueva_contraseña: string;
}

export interface UsuarioRespuesta {
  id_usuario: number;
  nombres?: string | null;
  apellidos?: string | null;
  numero_identificacion?: string | null;
  correo_usuario: string;
  rol?: string;
  roles?: string[];
  creado_en?: Date;
}