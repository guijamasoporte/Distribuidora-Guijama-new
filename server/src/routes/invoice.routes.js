import express from "express";
import {
  DeleteInvoiceById,
  GetAllInvoice,
  GetInvoicetById,
  UpdateInvoicetById,
  createInvoice,
} from "../controllers/invoice.controller.js";
import { isAdmin, verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();

router.post("/", [verifyToken, isAdmin], createInvoice);
router.get("/", GetAllInvoice);
router.get("/:id", GetInvoicetById);
router.put("/:id", [verifyToken, isAdmin], UpdateInvoicetById);
router.delete("/:id", [verifyToken, isAdmin], DeleteInvoiceById);


export default router;
