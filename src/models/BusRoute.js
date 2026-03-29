import mongoose from "mongoose";

const busRouteSchema = new mongoose.Schema(
  {
    route: { type: String, required: true, index: true },
    created_at: { type: Date, default: Date.now },
    drop_off_town: { type: String, required: true },
    route_status: { type: String, default: "Inactive", index: true },
    start_lat: { type: Number, required: true },
    end_lat: { type: Number, required: true },
    end_long: { type: Number, required: true },
    assigned_driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    buses: [
      {
        current_lat: { type: Number, required: true },
        current_long: { type: Number, required: true },
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.model("BusRoute", busRouteSchema, "bus_routes");
