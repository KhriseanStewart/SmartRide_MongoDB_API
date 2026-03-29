import mongoose from "mongoose";

const routeStopSchema = new mongoose.Schema(
  {
    route_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
      index: true,
    },
    location_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    stop_order: { type: Number, required: true },
    dwell_minutes: { type: Number, default: null },
    is_pickup: { type: Boolean, default: true },
    is_dropoff: { type: Boolean, default: false },
  },
  { timestamps: false, versionKey: false }
);

routeStopSchema.index({ route_id: 1, stop_order: 1 });

export default mongoose.model("RouteStop", routeStopSchema);
