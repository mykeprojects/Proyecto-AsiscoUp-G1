import { Router } from "express";
import { crearCrudController } from "../controllers/crud.controller.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";
import type { CrudService } from "../types/crud.js";

export function crearCrudRouter(service: CrudService): Router {
  const router = Router();
  const controller = crearCrudController(service);
  router.use(requireAdmin);
  router.get("/", controller.listar);
  router.get("/:id", controller.buscarPorId);
  router.post("/", controller.crear);
  router.put("/:id", controller.actualizar);
  router.delete("/:id", controller.eliminar);
  return router;
}
