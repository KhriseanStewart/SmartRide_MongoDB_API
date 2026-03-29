import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    full_name: { type: String, required: true },
    profile_url: { type: String, default: null },
    smart_card_cash: { type: Number, default: 0 },
    smart_card_num: { type: String, default: null },
    fav_routes: { type: [String], default: [] },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);
