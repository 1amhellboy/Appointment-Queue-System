import Patient from "../models/Patient.js";
import Queue from "../models/Queue.js";
import Appointment from "../models/Appointment.js";

// Helper → get today's date
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
};

export const createAppointment = async ({ clinicId, doctorId, name, phone }) => {
  // 1. Find or create patient
  let patient = await Patient.findOne({ phone });

  if (!patient) {
    patient = await Patient.create({ name, phone });
  }

  // 2. Get today's date
  const today = getTodayDate();

  // 3. Get or create queue (IMPORTANT: upsert)
  const queue = await Queue.findOneAndUpdate(
    { doctorId, date: today },
    {
      $setOnInsert: {
        clinicId,
        doctorId,
        date: today,
        avgConsultTime: 10, // default
      },
      $inc: { lastToken: 1 }, // 🔥 atomic increment
    },
    {
      new: true,
      upsert: true,
    }
  );

  // 3.5 Check if patient already has an active appointment in this queue
  const existingAppointment = await Appointment.findOne({
    patientId: patient._id,
    queueId: queue._id,
    status: { $in: ["waiting", "in_progress"] },
  });

  if (existingAppointment) {
    throw new Error("Patient already has an active appointment");
  }

  // 4. Get new token
  const tokenNumber = queue.lastToken;

  // 5. Calculate wait time
  const position = tokenNumber - queue.currentToken;
  const estimatedWaitTime = position * queue.avgConsultTime;

  // 6. Create appointment
  const appointment = await Appointment.create({
    clinicId,
    doctorId,
    queueId: queue._id,
    patientId: patient._id,
    tokenNumber,
    estimatedWaitTime,
  });

  return {
    appointment,
    tokenNumber,
    estimatedWaitTime,
  };
};


// ⏭️ Skip Appointment
export const skipAppointment = async ({ appointmentId }) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.status === "skipped") {
    throw new Error("Appointment already skipped");
  }

  if (appointment.status === "done") {
    throw new Error("Cannot skip completed appointment");
  }

  if (!["waiting", "in_progress"].includes(appointment.status)) {
    throw new Error("Only waiting or in-progress appointments can be skipped");
  }

  appointment.status = "skipped";
  await appointment.save();

  return appointment;
};

// ✅ Complete Appointment
export const completeAppointment = async ({ appointmentId }) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (appointment.status === "skipped") {
    throw new Error("Cannot complete skipped appointment");
  }

  if (appointment.status === "done") {
    throw new Error("Appointment already completed");
  }

  if (appointment.status !== "in_progress") {
    throw new Error("Only in-progress appointments can be completed");
  }

  appointment.status = "done";
  await appointment.save();

  return appointment;
};
