import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    route_code: { type: String, required: true },
    name: { type: String, required: true },
    is_active: { type: Boolean, default: true, index: true },
    start_location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    end_location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false }, versionKey: false }
);

export default mongoose.model("Route", routeSchema);
