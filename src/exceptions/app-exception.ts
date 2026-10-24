export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestException extends AppError {
  constructor(message: string = "Solicitud inválida") {
    super(message, 400);
  }
}

export class UnauthorizedException extends AppError {
  constructor(message: string = "No autorizado") {
    super(message, 401);
  }
}

export class NotFoundException extends AppError {
  constructor(message: string = "Recurso no encontrado") {
    super(message, 404);
  }
}

export class ConflictException extends AppError {
  constructor(message: string = "El recurso ya existe") {
    super(message, 409);
  }
}