pm.test("Crea el usuario", () => pm.response.to.have.status(201));
pm.test("Entrega datos públicos", () => {
  const usuario = pm.response.json();
  pm.expect(usuario.id_usuario).to.be.a("number");
  pm.expect(usuario.nombres).to.equal("Ana");
  pm.expect(usuario.apellidos).to.equal("Peña");
  pm.expect(usuario.correo_usuario).to.equal("registro-postman@example.com");
  pm.expect(usuario).not.to.have.property("contraseña_usuario");
});
