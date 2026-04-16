import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    currentToken: {
      type: Number,
      default: 0,
    },

    lastToken: {
      type: Number,
      default: 0,
    },

    avgConsultTime: {
      type: Number,
      default: 10,
    },

    status: {
      type: String,
      enum: ["active", "paused", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

// 🔥 IMPORTANT: one queue per doctor per day
queueSchema.index({ doctorId: 1, date: 1 }, { unique: true });

export default mongoose.model("Queue", queueSchema);