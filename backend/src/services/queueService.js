import Queue from "../models/Queue.js";
import Appointment from "../models/Appointment.js";

export const nextPatient = async ({ queueId }) => {
  // 1. Get queue
  const queue = await Queue.findById(queueId);

  if (!queue) {
    throw new Error("Queue not found");
  }

  // 2. Current token before increment
  const currentToken = queue.currentToken;

  // 3. Mark current appointment as done
  if (currentToken > 0) {
    await Appointment.findOneAndUpdate(
      {
        queueId,
        tokenNumber: currentToken,
        status: "in_progress",
      },
      {
        status: "done",
      }
    );
  }

  // 4. Move to next token
  queue.currentToken += 1;
  await queue.save();

  // 5. Set next appointment to in_progress
  const nextAppointment = await Appointment.findOneAndUpdate(
    {
      queueId,
      tokenNumber: queue.currentToken,
    },
    {
      status: "in_progress",
    },
    { new: true }
  );

  return {
    currentToken: queue.currentToken,
    nextAppointment,
  };
};


export const getQueueAppointments = async ({ queueId, status }) => {
  const filter = { queueId };

  // Optional filter
  if (status) {
    filter.status = status;
  }

  const appointments = await Appointment.find(filter)
    .populate("patientId", "name phone")
    .sort({ tokenNumber: 1 });

  return appointments;
};


const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};


export const getTodayQueue = async ({ clinicId, doctorId }) => {
  const today = getTodayDate();

  const queue = await Queue.findOneAndUpdate(
    { doctorId, date: today },
    {
      $setOnInsert: {
        clinicId,
        doctorId,
        date: today,
        avgConsultTime: 10,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  return queue;
};