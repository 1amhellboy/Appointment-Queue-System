import { createAppointment } from "../services/appointmentService.js";

export const create = async (req, res) => {
  try {
    const { doctorId, name, phone } = req.body;

    const clinicId = req.user.clinicId; // from auth middleware

    const data = await createAppointment({
      clinicId,
      doctorId,
      name,
      phone,
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};