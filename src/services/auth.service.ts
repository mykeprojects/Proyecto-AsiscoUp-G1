import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException, UnauthorizedException } from "../exceptions/app-exception.js";
import { UserRepository } from "../repositories/user.repository.js";
import type { CambiarContrasenaDTO, LoginDTO, RegistroDTO, UsuarioRespuesta } from "../types/auth.types.js";
import { getJwtSecret } from "../config/jwt.js";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registrar(dto: RegistroDTO, permitirAdministrador = false): Promise<UsuarioRespuesta> {
    if (!dto.nombres?.trim() || !dto.apellidos?.trim() || !dto.numero_identificacion?.trim() ||
        !dto.correo_usuario?.trim() || !dto.contraseña_usuario || !dto.rol?.trim()) {
      throw new BadRequestException("nombres, apellidos, numero_identificacion, correo_usuario, contraseña_usuario y rol son obligatorios");
    }
    if (dto.contraseña_usuario.length < 8) {
      throw new BadRequestException("La contraseña debe tener al menos 8 caracteres");
    }
    if (dto.fecha_nacimiento && Number.isNaN(Date.parse(dto.fecha_nacimiento))) {
      throw new BadRequestException("fecha_nacimiento debe ser una fecha válida");
    }
    dto.nombres = dto.nombres.trim();
    dto.apellidos = dto.apellidos.trim();
    dto.numero_identificacion = dto.numero_identificacion.trim();
    dto.correo_usuario = dto.correo_usuario.trim().toLowerCase();
    dto.rol = dto.rol.trim();
    if (!permitirAdministrador && dto.rol.toUpperCase() === "ADMIN") {
      throw new ForbiddenException("El rol ADMIN solo puede asignarlo un administrador");
    }

    const usuarioExistente = await this.userRepository.buscarPorCorreo(dto.correo_usuario);
    if (usuarioExistente) {
      throw new ConflictException("Ese correo ya está registrado");
    }
    const identificacionExistente = await this.userRepository.buscarPorNumeroIdentificacion(dto.numero_identificacion);
    if (identificacionExistente) {
      throw new ConflictException("Ese número de identificación ya está registrado");
    }

    const claveCifrada = await bcrypt.hash(dto.contraseña_usuario, 10);
    return await this.userRepository.crearConRol(dto, claveCifrada);
  }

  async login(dto: LoginDTO) {
    if (!dto.correo_usuario || !dto.contraseña_usuario) {
      throw new BadRequestException("El correo y la contraseña son obligatorios");
    }

    const usuario = await this.userRepository.buscarPorCorreo(dto.correo_usuario);
    if (!usuario) {
      throw new UnauthorizedException("Correo o contraseña incorrectos");
    }

    const esValida = await bcrypt.compare(dto.contraseña_usuario, usuario.contraseña_usuario);
    if (!esValida) {
      throw new UnauthorizedException("Correo o contraseña incorrectos");
    }

    const token = jwt.sign({ id_usuario: usuario.id_usuario }, getJwtSecret(), { expiresIn: "2h" });

    return {
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        correo_usuario: usuario.correo_usuario,
        roles: usuario.rol_usuario.map((r) => r.rol.nombre_rol),
      },
    };
  }

  async obtenerPerfil(id_usuario: number) {
    const usuario = await this.userRepository.buscarPorId(id_usuario);
    if (!usuario) {
      throw new NotFoundException("Usuario no encontrado");
    }
    return usuario;
  }

  async cambiarContrasena(id_usuario: number, dto: CambiarContrasenaDTO) {
    if (!dto.contraseña_actual || !dto.nueva_contraseña) {
      throw new BadRequestException("La contraseña actual y la nueva son obligatorias");
    }

    const usuarioBase = await this.userRepository.buscarPorId(id_usuario);
    
    if (!usuarioBase) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const usuarioCompleto = await this.userRepository.buscarPorCorreo(usuarioBase.correo_usuario);
    const esValida = usuarioCompleto
      ? await bcrypt.compare(dto.contraseña_actual, usuarioCompleto.contraseña_usuario)
      : false;
    if (!esValida) {
      throw new UnauthorizedException("La contraseña actual es incorrecta");
    }

    const nuevaClaveCifrada = await bcrypt.hash(dto.nueva_contraseña, 10);
    await this.userRepository.actualizarContrasena(id_usuario, nuevaClaveCifrada);

    return { mensaje: "Contraseña actualizada exitosamente" };
  }
}