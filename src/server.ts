import "dotenv/config";
import { app } from "./app.js";
import { readConfig } from "./config.js";

const config = readConfig();

app.listen(config.port, config.host, () => {
  console.log(`Servidor corriendo en http://${config.host}:${config.port}`);
});