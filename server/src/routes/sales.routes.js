import express from "express";
import {
  DeleteSaleById,
  GetAllSale,
  GetSaletById,
  UpdateSaletById,
  createSale,
} from "../controllers/sales.controller.js";
import { isAdmin, verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();

router.post("/", createSale);
router.get("/", GetAllSale);
router.get("/:id", GetSaletById);
router.put("/:id", [verifyToken, isAdmin], UpdateSaletById);
router.delete("/:id", [verifyToken, isAdmin], DeleteSaleById);


export default router;
