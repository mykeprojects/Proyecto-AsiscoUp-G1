-- CreateTable
CREATE TABLE "estado" (
    "codigo_estado" TEXT NOT NULL,
    "descripcion_estado" TEXT NOT NULL,

    CONSTRAINT "estado_pkey" PRIMARY KEY ("codigo_estado")
);

-- CreateTable
CREATE TABLE "rol" (
    "codigo_rol" TEXT NOT NULL,
    "nombre_rol" TEXT NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("codigo_rol")
);

-- CreateTable
CREATE TABLE "permiso" (
    "codigo_permiso" TEXT NOT NULL,
    "descripcion_permiso" TEXT NOT NULL,

    CONSTRAINT "permiso_pkey" PRIMARY KEY ("codigo_permiso")
);

-- CreateTable
CREATE TABLE "usuario" (
    "codigo_usuario" UUID NOT NULL DEFAULT gen_random_uuid(),
    "correo_usuario" TEXT NOT NULL,
    "contraseña_usuario" TEXT NOT NULL,
    "acepta_terminos_condiciones" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("codigo_usuario")
);

-- CreateTable
CREATE TABLE "sesion" (
    "codigo_sesion" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codigo_usuario" UUID NOT NULL,
    "token_sesion" TEXT NOT NULL,
    "fecha_hora_sesion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesion_pkey" PRIMARY KEY ("codigo_sesion")
);

-- CreateTable
CREATE TABLE "estado_usuario" (
    "id_estado_usuario" BIGSERIAL NOT NULL,
    "codigo_usuario" UUID NOT NULL,
    "codigo_estado" TEXT NOT NULL,
    "fecha_estado_usuario" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estado_usuario_pkey" PRIMARY KEY ("id_estado_usuario")
);

-- CreateTable
CREATE TABLE "rol_usuario" (
    "id_rol_usuario" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codigo_usuario" UUID NOT NULL,
    "codigo_rol" TEXT NOT NULL,

    CONSTRAINT "rol_usuario_pkey" PRIMARY KEY ("id_rol_usuario")
);

-- CreateTable
CREATE TABLE "permiso_rol" (
    "id_permiso_rol" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codigo_rol" TEXT NOT NULL,
    "codigo_permiso" TEXT NOT NULL,

    CONSTRAINT "permiso_rol_pkey" PRIMARY KEY ("id_permiso_rol")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_usuario_key" ON "usuario"("correo_usuario");

-- AddForeignKey
ALTER TABLE "sesion" ADD CONSTRAINT "sesion_codigo_usuario_fkey" FOREIGN KEY ("codigo_usuario") REFERENCES "usuario"("codigo_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "estado_usuario" ADD CONSTRAINT "estado_usuario_codigo_estado_fkey" FOREIGN KEY ("codigo_estado") REFERENCES "estado"("codigo_estado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "estado_usuario" ADD CONSTRAINT "estado_usuario_codigo_usuario_fkey" FOREIGN KEY ("codigo_usuario") REFERENCES "usuario"("codigo_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rol_usuario" ADD CONSTRAINT "rol_usuario_codigo_rol_fkey" FOREIGN KEY ("codigo_rol") REFERENCES "rol"("codigo_rol") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rol_usuario" ADD CONSTRAINT "rol_usuario_codigo_usuario_fkey" FOREIGN KEY ("codigo_usuario") REFERENCES "usuario"("codigo_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permiso_rol" ADD CONSTRAINT "permiso_rol_codigo_permiso_fkey" FOREIGN KEY ("codigo_permiso") REFERENCES "permiso"("codigo_permiso") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permiso_rol" ADD CONSTRAINT "permiso_rol_codigo_rol_fkey" FOREIGN KEY ("codigo_rol") REFERENCES "rol"("codigo_rol") ON DELETE CASCADE ON UPDATE NO ACTION;
