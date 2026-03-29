import express from "express";
import { requireUser } from "../middleware/requireUser.js";
import { validateBody } from "../middleware/validate.js";
import {
  listMyTransactions,
  createTransaction,
  addCash,
} from "../controllers/transactionController.js";
import { createTransactionSchema, addCashSchema } from "../schemas/transactionSchema.js";

const router = express.Router();

router.get("/", requireUser, listMyTransactions);
router.post("/", requireUser, validateBody(createTransactionSchema), createTransaction);
router.post("/add", requireUser, validateBody(addCashSchema), addCash);

export default router;
