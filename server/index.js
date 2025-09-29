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

const app = express();

const whiteList = [process.env.DEPLOY_CLIENT_URL, "http://localhost:3001"];

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

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("server listen on port", port);
});
