import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, default: "India" },
    address: { type: String, required: true },
    zipCode: { type: String },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    phone: String,
    email: String,
    image: String,
    operatingHours: {
      open: { type: String, default: "08:00" },
      close: { type: String, default: "20:00" },
      is24Hours: { type: Boolean, default: false },
      workingDays: { type: [String], default: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    },
    isActive: { type: Boolean, default: true },
    isPickupAvailable: { type: Boolean, default: true },
    isDropAvailable: { type: Boolean, default: true },
    airportLocation: { type: Boolean, default: false },
    carCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

locationSchema.index({ city: 1, isActive: 1 });
locationSchema.index({ name: "text", city: "text", address: "text" });

const Location = mongoose.model("Location", locationSchema);
export default Location;
