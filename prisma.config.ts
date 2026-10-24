import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Si DIRECT_URL es undefined, pasará un string vacío "" cumpliendo con el tipo string
    url: process.env["DIRECT_URL"] ?? "", 
  },
});
