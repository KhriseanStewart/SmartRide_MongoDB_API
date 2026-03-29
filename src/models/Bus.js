import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    current_lat: { type: Number, required: true },
    current_long: { type: Number, required: true },
    bearing: { type: Number, default: null },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusRoute",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Bus", busSchema);
