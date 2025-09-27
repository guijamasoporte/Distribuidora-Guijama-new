import express from "express";
import {
  DeleteBuyById,
  GetAllBuy,
  GetBuytById,
  UpdateBuyById,
  createBuy,
} from "../controllers/buy.controller.js";
import { isAdmin, verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();

router.post("/", createBuy);
router.get("/", GetAllBuy);
router.get("/:id", GetBuytById);
router.put("/:id", [verifyToken, isAdmin], UpdateBuyById);
router.delete("/:id", [verifyToken, isAdmin], DeleteBuyById);

export default router;
