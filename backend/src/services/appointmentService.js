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
