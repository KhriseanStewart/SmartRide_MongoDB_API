import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

async function listMyTransactions(req, res, next) {
  try {
    const rows = await Transaction.find({ user_id: req.userId }).sort({ created_at: -1 }).lean();
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function createTransaction(req, res, next) {
  try {
    const row = await Transaction.create({
      ...req.body,
      user_id: req.userId,
      sent_at: req.body.sent_at || new Date(),
      paid_at: req.body.paid_at || new Date(),
    });
    res.status(201).json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
}

async function addCash(req, res, next) {
  try {
    const amount = Number(req.body.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "amount must be > 0" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { smart_card_cash: amount } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const history = await Transaction.create({
      user_id: req.userId,
      amount,
      status: "completed",
      route: "Add Cash",
      sent_at: new Date(),
      paid_at: new Date(),
    });

    res.json({ success: true, data: { user, transaction: history } });
  } catch (err) {
    next(err);
  }
}

export { listMyTransactions, createTransaction, addCash };
