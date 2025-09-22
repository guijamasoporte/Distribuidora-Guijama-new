import express from "express";
import {
  createSupplier,
  deleteSupplierById,
  getSupplierById,
  getAllSupplier,
  updateSuppliernById,
} from "../controllers/supplier.controller.js";
import { verifyToken, isAdmin } from "../middlewares/VerifyToken.js";

const router = express.Router();

//AGREGAR MIDDLEWARE ↓
router.post("/", createSupplier);
router.get("/", getAllSupplier);
router.get("/:id", getSupplierById);
router.put("/:id", [verifyToken, isAdmin], updateSuppliernById);
router.delete("/:id", [verifyToken, isAdmin], deleteSupplierById);

export default router;
