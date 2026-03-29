import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    driver_first_name: { type: String, required: true },
    driver_last_name: { type: String, default: null },
    driver_age: { type: Number, default: null },
    telephone: { type: String, default: "" },
    telephone_number: { type: String, default: "" },
  },
  { timestamps: false, versionKey: false }
);

export default mongoose.model("Driver", driverSchema);
