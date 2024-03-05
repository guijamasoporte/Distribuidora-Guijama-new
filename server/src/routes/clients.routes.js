import express from "express";
import {
  createClient,
  deleteClientById,
  getClientById,
  getAllClient,
  updateClientnById,
} from "../controllers/clients.controller.js";
import { verifyToken, isAdmin } from "../middlewares/VerifyToken.js";

const router = express.Router();

//AGREGAR MIDDLEWARE ↓
router.post("/create", [verifyToken, isAdmin], createClient);
router.get("/", getAllClient);
router.get("/:id", getClientById);
router.put("/:id", [verifyToken, isAdmin], updateClientnById);
router.delete("/:id", [verifyToken, isAdmin], deleteClientById);

export default router;
