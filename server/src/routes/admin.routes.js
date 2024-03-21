import express from "express";
import {
  createAdmin,
  deleteAdminById,
  getAdminById,
  getAllAdmin,
  updateAdminById,
} from "../controllers/admin.controller.js";
import { isAdmin, verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();

router.post("/create", createAdmin);
router.get("/", [verifyToken, isAdmin], getAllAdmin);
router.get("/:id", getAdminById);
router.put("/:id", [verifyToken, isAdmin], updateAdminById);
router.delete("/:id", [verifyToken, isAdmin], deleteAdminById);

export default router;
