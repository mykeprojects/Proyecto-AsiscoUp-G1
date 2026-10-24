import assert from "node:assert/strict";
import { test } from "node:test";
import { once } from "node:events";
import bcrypt from "bcryptjs";
import { readConfig } from "../src/config.js";

test("configuración rechaza URL y puerto inválidos", () => {
  assert.throws(() => readConfig({}));
  assert.throws(() => readConfig({ DATABASE_URL: "https://example.com/db" }));
  assert.throws(() => readConfig({ DATABASE_URL: "postgresql://test@localhost/test", PORT: "0" }));
});

test("registro HTTP con PostgreSQL aislado", { skip: !process.env["TEST_DATABASE_URL"] }, async () => {
  const url = new URL(process.env["TEST_DATABASE_URL"]!);
  assert.equal(url.hostname, "127.0.0.1");
  assert.equal(url.pathname, "/registro_test");
  process.env["DATABASE_URL"] = url.toString();
  const { app } = await import("../src/app.js");
  const { prisma, checkDatabase } = await import("../src/prisma.js");
  await checkDatabase();
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const base = `http://127.0.0.1:${address.port}`;
  const correo = `test-${crypto.randomUUID()}@example.com`;
  const clave = "ClaveDePrueba123!";
  const post = (body: unknown) => fetch(`${base}/api/auth/registro`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const postEstudiante = (body: unknown) => fetch(`${base}/api/auth/registro/estudiante`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  try {
    const response = await post({
      nombres: "  Ana  ", apellidos: " Peña  ", numero_identificacion: "1000000001",
      correo_usuario: ` ${correo.toUpperCase()} `, contraseña_usuario: clave, rol: "ESTUDIANTE",
    });
    assert.equal(response.status, 201);
    const usuario = await response.json();
    assert.equal(usuario.nombres, "Ana");
    assert.equal(usuario.apellidos, "Peña");
    assert.equal(usuario.correo_usuario, correo);
    assert.equal("contraseña_usuario" in usuario, false);
    const estudiantePorRuta = await postEstudiante({
      nombres: "Luis",
      apellidos: "Gómez",
      numero_identificacion: "1000000003",
      correo_usuario: `ruta-${correo}`,
      contraseña_usuario: clave,
      rol: "ADMIN",
    });
    assert.equal(estudiantePorRuta.status, 201);
    assert.equal((await estudiantePorRuta.json()).rol, "ESTUDIANTE");
    const stored = await prisma.usuario.findUniqueOrThrow({ where: { correo_usuario: correo } });
    assert.notEqual(stored.contraseña_usuario, clave);
    assert.ok(await bcrypt.compare(clave, stored.contraseña_usuario));
    assert.equal((await post({
      nombres: "Ana", apellidos: "Pérez", numero_identificacion: "1000000002",
      correo_usuario: correo, contraseña_usuario: clave, rol: "ESTUDIANTE",
    })).status, 409);
    for (const body of [
      {}, { nombres: " ", apellidos: "Pérez", numero_identificacion: "2", correo_usuario: correo, contraseña_usuario: clave, rol: "ESTUDIANTE" },
      { nombres: "Ana", apellidos: "Pérez", numero_identificacion: "3", correo_usuario: "invalido", contraseña_usuario: clave, rol: "ESTUDIANTE" },
      { nombres: "Ana", apellidos: "Pérez", numero_identificacion: "4", correo_usuario: correo, contraseña_usuario: "corta", rol: "ESTUDIANTE" },
    ]) assert.equal((await post(body)).status, 400);
    const malformed = await fetch(`${base}/api/auth/registro`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
    assert.equal(malformed.status, 400);
    const raceEmail = `race-${crypto.randomUUID()}@example.com`;
    const concurrent = await Promise.all([
      post({ nombres: "Ana", apellidos: "Pérez", numero_identificacion: "10", correo_usuario: raceEmail, contraseña_usuario: clave, rol: "ESTUDIANTE" }),
      post({ nombres: "Ana", apellidos: "Pérez", numero_identificacion: "11", correo_usuario: raceEmail, contraseña_usuario: clave, rol: "ESTUDIANTE" }),
    ]);
    assert.deepEqual(concurrent.map(r => r.status).sort(), [201, 409]);
    assert.equal((await fetch(`${base}/usuarios`)).status, 404);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    await prisma.$disconnect();
  }
});
