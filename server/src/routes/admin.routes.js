import express from "express";
import {
  createAdmin,
  deleteAdminById,
  getAdminById,
  getAllAdmin,
  updateAdminById,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/VerifyToken.js";

// import { isAdmin, verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();

//AGREGAR MIDDLEWARE ↓
router.post("/create", createAdmin);
router.get("/", getAllAdmin);
router.get("/:id",[verifyToken], getAdminById);
router.put("/:id", updateAdminById);
router.delete("/:id", deleteAdminById);

export default router;
