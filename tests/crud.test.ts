import assert from "node:assert/strict";
import { test } from "node:test";
import { once } from "node:events";
import { BadRequestException, NotFoundException } from "../src/exceptions/app-exception.js";
import { crearCrudService } from "../src/services/crud.service.js";
import {
  estadoActualizarSchema,
  estadoCrearSchema,
  usuarioCrearSchema,
} from "../src/types/crud.schemas.js";
import type { EstadoActualizar, EstadoCrear } from "../src/types/crud.schemas.js";
import type { CrudRepository } from "../src/types/crud.js";

test("validación de escritura normaliza y elimina campos opcionales ausentes", () => {
  const usuario = usuarioCrearSchema.parse({
    nombres: "Ana",
    apellidos: "Pérez",
    numero_identificacion: "123",
    correo_usuario: "  ANA@example.com ",
    contraseña_usuario: "clave-segura-123",
  });
  assert.equal(usuario.correo_usuario, "ana@example.com");
  assert.equal("telefono" in usuario, false);

  assert.throws(
    () => usuarioCrearSchema.parse({
      nombres: "Ana",
      apellidos: "Pérez",
      numero_identificacion: "123",
      correo_usuario: "no-es-correo",
      contraseña_usuario: "corta",
      extra: true,
    }),
    { name: "ZodError" },
  );
});

test("las actualizaciones requieren al menos un campo válido", () => {
  assert.throws(() => estadoActualizarSchema.parse({}), { name: "ZodError" });
  assert.deepEqual(estadoCrearSchema.parse({ descripcion: " Activo " }), { descripcion: "Activo" });
});

test("el servicio central valida, pagina y traduce recursos inexistentes", async () => {
  const repository: CrudRepository<EstadoCrear, EstadoActualizar> = {
    listar: async (skip, take) => [{ skip, take }],
    buscarPorId: async (id) => id === 1 ? { id_estado: 1, descripcion: "Activo" } : null,
    crear: async (data) => data,
    actualizar: async (id, data) => ({ id_estado: id, ...data }),
    eliminar: async () => {},
  };
  const service = crearCrudService(repository, {
    crear: estadoCrearSchema,
    actualizar: estadoActualizarSchema,
  });

  assert.deepEqual(await service.listar(20, 10), [{ skip: 20, take: 10 }]);
  assert.deepEqual(await service.crear({ descripcion: "Activo" }), { descripcion: "Activo" });
  await assert.rejects(service.crear({ desconocido: true }), BadRequestException);
  assert.deepEqual(await service.buscarPorId(1), { id_estado: 1, descripcion: "Activo" });
  await assert.rejects(service.buscarPorId(2), NotFoundException);
});

test("health y Swagger responden; las rutas protegidas exigen autenticación", async () => {
  process.env["DATABASE_URL"] ??= "postgresql://test:test@127.0.0.1:5432/test";
  process.env["JWT_SECRET"] ??= "clave-de-prueba-con-32-bytes-minimo";
  process.env["NODE_ENV"] = "test";
  process.env["PUBLIC_URL"] = "https://api.example.test/";
  const { app } = await import("../src/app.js");
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address === "object");

  try {
    const healthResponse = await fetch(`http://127.0.0.1:${address.port}/health`);
    assert.equal(healthResponse.status, 200);
    assert.deepEqual(await healthResponse.json(), { status: "ok" });

    const swaggerResponse = await fetch(`http://127.0.0.1:${address.port}/api-docs/`);
    assert.equal(swaggerResponse.status, 200);
    const swaggerHtml = await swaggerResponse.text();
    assert.match(swaggerHtml, /Documentación API AsiscoUp/);
    assert.match(swaggerHtml, /background-color: #17324d/);
    assert.match(swaggerResponse.headers.get("content-security-policy") ?? "", /default-src 'self'/);
    assert.equal(swaggerResponse.headers.get("x-content-type-options"), "nosniff");
    assert.match(
      swaggerResponse.headers.get("strict-transport-security") ?? "",
      /max-age=/,
    );

    const swaggerConfigResponse = await fetch(
      `http://127.0.0.1:${address.port}/api-docs/swagger-ui-init.js`,
    );
    assert.equal(swaggerConfigResponse.status, 200);
    const swaggerConfig = await swaggerConfigResponse.text();
    assert.match(swaggerConfig, /persistAuthorization.*false/s);
    assert.match(swaggerConfig, /validatorUrl.*null/s);

    const swaggerCssResponse = await fetch(
      `http://127.0.0.1:${address.port}/api-docs/swagger-ui.css`,
    );
    assert.equal(swaggerCssResponse.status, 200);

    const openApiResponse = await fetch(
      `http://127.0.0.1:${address.port}/api-docs.json`,
    );
    assert.equal(openApiResponse.status, 200);
    assert.equal(openApiResponse.headers.get("cache-control"), "no-cache");
    const openApi = await openApiResponse.json();
    assert.equal(openApi.openapi, "3.0.3");
    assert.equal(openApi.components.securitySchemes.bearerAuth.type, "http");
    assert.deepEqual(openApi.servers.map(({ url }) => url), [
      "https://api.example.test",
      `http://localhost:${process.env["PORT"] ?? 3000}`,
    ]);
    assert.ok(openApi.paths["/api/usuarios/{id}"].put);
    assert.ok(openApi.paths["/api/estados/{id}"].delete.responses["204"]);
    assert.deepEqual(openApi.paths["/api/auth/login"].post.security, []);
    assert.deepEqual(openApi.security[0].bearerAuth, []);
    for (const path of [
      "/health",
      "/api/auth/registro",
      "/api/auth/perfil",
      "/api/estados",
      "/api/roles",
      "/api/permisos",
      "/api/usuarios",
      "/api/usuarios/con-rol",
      "/api/sesiones",
      "/api/estados-usuario",
      "/api/roles-usuario",
      "/api/permisos-rol",
    ]) {
      assert.ok(openApi.paths[path], `Falta documentar ${path}`);
    }

    const compatibilityResponse = await fetch(
      `http://127.0.0.1:${address.port}/api-docs/openapi.json`,
    );
    assert.equal(compatibilityResponse.status, 200);

    const bases = [
      "/api/estados", "/api/roles", "/api/permisos", "/api/usuarios",
      "/api/usuarios/con-rol", "/api/usuarios/con-rol/1",
      "/api/sesiones", "/api/estados-usuario", "/api/roles-usuario", "/api/permisos-rol",
    ];
    const responses = await Promise.all(bases.map((path) =>
      fetch(`http://127.0.0.1:${address.port}${path}`),
    ));
    assert.deepEqual(responses.map(({ status }) => status), Array(bases.length).fill(401));
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
});
