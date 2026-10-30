import type { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../exceptions/app-exception.js";
import type { CrudService } from "../types/crud.js";

function enteroConsulta(value: unknown, fallback: number, maximum: number): number {
  if (value === undefined) return fallback;
  if (typeof value !== "string") {
    throw new BadRequestException("El parámetro debe ser un entero");
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > maximum) {
    throw new BadRequestException(`El parámetro debe ser un entero entre 1 y ${maximum}`);
  }
  return parsed;
}

function enteroId(value: unknown): number {
  if (typeof value !== "string") throw new BadRequestException("El ID debe ser un entero positivo");
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new BadRequestException("El ID debe ser un entero positivo");
  }
  return id;
}

export function crearCrudConsultaController(service: Pick<CrudService, "listar" | "buscarPorId">) {
  return {
    listar: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const page = enteroConsulta(req.query["page"], 1, Number.MAX_SAFE_INTEGER);
        const limit = enteroConsulta(req.query["limit"], 20, 100);
        const skip = (page - 1) * limit;
        if (!Number.isSafeInteger(skip)) throw new BadRequestException("La página solicitada es demasiado grande");
        const data = await service.listar(skip, limit);
        res.json({ data, pagination: { page, limit } });
      } catch (error) {
        next(error);
      }
    },
    buscarPorId: async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.json(await service.buscarPorId(enteroId(req.params["id"])));
      } catch (error) {
        next(error);
      }
    },
  };
}

export function crearCrudController(service: CrudService) {
  return {
    ...crearCrudConsultaController(service),
    crear: async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.status(201).json(await service.crear(req.body));
      } catch (error) {
        next(error);
      }
    },
    actualizar: async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.json(await service.actualizar(enteroId(req.params["id"]), req.body));
      } catch (error) {
        next(error);
      }
    },
    eliminar: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.eliminar(enteroId(req.params["id"]));
        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },
  };
}
