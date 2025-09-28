import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import bodyParser from "body-parser";
import "./src/dataBase/connectDB.js";

import authRouter from "./src/routes/auth.routes.js";
import AdminRoute from "./src/routes/admin.routes.js";
import productRoute from "./src/routes/product.routes.js";
import clientRoute from "./src/routes/clients.routes.js";
import salesRoute from "./src/routes/sales.routes.js";
import supplierRoute from "./src/routes/supplier.routes.js";
import buyRoute from "./src/routes/buy.route.js";

const app = express();

const whiteList = [process.env.DEPLOY_CLIENT_URL, "http://localhost:3001","https://distribuidora-guijama-new.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("😲😲😲 =>", origin);
      if (!origin || whiteList.includes(origin)) {
        return callback(null, origin);
      }
      return callback("Error de CORS origin: " + origin + " No autorizado!");
    },
    credentials: true,
  })
);

// app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));

app.use("/", authRouter);
app.use("/admin", AdminRoute);
app.use("/products", productRoute);
app.use("/clients", clientRoute);
app.use("/sales", salesRoute);
app.use("/supplier", supplierRoute);
app.use("/buy", buyRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("server listen on port", port);
});
