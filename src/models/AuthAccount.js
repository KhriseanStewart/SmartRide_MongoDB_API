import mongoose from "mongoose";

const authAccountSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password_salt: { type: String, required: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["user", "driver"], required: true, index: true },
    user_id: { type: String, default: null, index: true },
    driver_id: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", default: null, index: true },
    must_reset_password: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("AuthAccount", authAccountSchema);
