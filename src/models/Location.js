import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    parish: { type: String, default: null },
  },
  { timestamps: false, versionKey: false }
);

export default mongoose.model("Location", locationSchema);
