import type { ZodType } from "zod";
import { BadRequestException, NotFoundException } from "../exceptions/app-exception.js";
import type { CrudRepository, CrudService } from "../types/crud.js";

function validar<T>(schema: ZodType<T>, body: unknown): T {
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof Error && "issues" in error && Array.isArray(error.issues)) {
      throw new BadRequestException(error.issues.map((issue: { message: string }) => issue.message).join("; "));
    }
    throw error;
  }
}

export function crearCrudService<CreateInput, UpdateInput>(
  repository: CrudRepository<CreateInput, UpdateInput>,
  schemas: { crear: ZodType<CreateInput>; actualizar: ZodType<UpdateInput> },
  transforms: {
    crear?: (data: CreateInput) => Promise<CreateInput>;
    actualizar?: (data: UpdateInput) => Promise<UpdateInput>;
  } = {},
): CrudService {
  return {
    listar: (skip, take) => repository.listar(skip, take),
    buscarPorId: async (id) => {
      const recurso = await repository.buscarPorId(id);
      if (!recurso) throw new NotFoundException("Recurso no encontrado");
      return recurso;
    },
    crear: async (body) => {
      const data = validar(schemas.crear, body);
      return repository.crear(transforms.crear ? await transforms.crear(data) : data);
    },
    actualizar: async (id, body) => {
      const data = validar(schemas.actualizar, body);
      return repository.actualizar(id, transforms.actualizar ? await transforms.actualizar(data) : data);
    },
    eliminar: (id) => repository.eliminar(id),
  };
}
