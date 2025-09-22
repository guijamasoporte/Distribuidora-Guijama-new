import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { Product } from "../models/products.js";
import { Admin } from "../models/admin.js";
import { Client } from "../models/clients.js";
import { Sale } from "../models/sale.js";
import "dotenv/config";
// Configuración de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKUP_DIR = path.join(__dirname, "./backups");

// Crear directorio si no existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export async function createModelBackups() {
  // Reutilizar la conexión existente de Mongoose
  const connection = mongoose.connection;

  try {
    console.log("🚀 Iniciando backup directo de modelos...");

    // Verificar estado de la conexión
    if (connection.readyState !== 1) {
      throw new Error("No hay conexión activa a MongoDB");
    }

    // Configurar timeouts extendidos
    const findOptions = {
      maxTimeMS: 30000, // 30 segundos de timeout
    };

    // Obtener datos en paralelo con la conexión existente
    const [products, admins, clients, sales] = await Promise.all([
      Product.find({}, null, findOptions).lean(),
      Admin.find({}, null, findOptions).lean(),
      Client.find({}, null, findOptions).lean(),
      Sale.find({}, null, findOptions).lean(),
    ]);

    // Guardar archivos
    fs.writeFileSync(
      path.join(BACKUP_DIR, "products.json"),
      JSON.stringify(products, null, 2)
    );

    fs.writeFileSync(
      path.join(BACKUP_DIR, "admin.json"),
      JSON.stringify(admins, null, 2)
    );

    fs.writeFileSync(
      path.join(BACKUP_DIR, "client.json"),
      JSON.stringify(clients, null, 2)
    );
    fs.writeFileSync(
      path.join(BACKUP_DIR, "sales.json"),
      JSON.stringify(sales, null, 2)
    );

    console.log("💾 Backup completado exitosamente");
    console.log(`📊 Resultados:
      Productos: ${products.length} registros
      Admins: ${admins.length} registros
      Usuarios: ${clients.length} registros
      sales: ${sales.length} registros`);

    return {
      success: true,
      counts: {
        products: products.length,
        admins: admins.length,
        clients: clients.length,
        sale: sales.length,
      },
    };
  } catch (error) {
    console.error("🔥 Error durante el backup:", error.message);
    return { success: false, error: error.message };
  }
}

// Ejecutar si es llamado directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Conectar a MongoDB solo si se ejecuta directamente
  mongoose
    .connect(process.env.URI_MONGO, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 40000,
    })
    .then(() => createModelBackups())
    .then((result) => process.exit(result.success ? 0 : 1))
    .catch((error) => {
      console.error("❌ Error de conexión:", error.message);
      process.exit(1);
    });
}
