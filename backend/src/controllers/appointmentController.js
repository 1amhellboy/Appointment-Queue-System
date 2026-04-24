import { createAppointment, skipAppointment, completeAppointment, } from "../services/appointmentService.js";

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


// ⏭️ Skip
export const skip = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await skipAppointment({ appointmentId: id });

    res.status(200).json({
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

// ✅ Complete
export const complete = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await completeAppointment({ appointmentId: id });

    res.status(200).json({
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