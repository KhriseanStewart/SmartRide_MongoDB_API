import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, index: true },
    receiver_id: { type: String, default: null },
    driver_id: { type: String, default: "" },
    route: { type: String, default: "" },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
    sent_at: { type: Date, default: null },
    received_at: { type: Date, default: null },
    paid_at: { type: Date, default: null },
    created_at: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
  },
  { timestamps: false, versionKey: false }
);

transactionSchema.index({ user_id: 1, created_at: -1 });

transactionSchema.pre("save", function preSave(next) {
  this.last_updated = new Date();
  next();
});

export default mongoose.model("Transaction", transactionSchema);
