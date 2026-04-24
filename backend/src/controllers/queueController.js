import { nextPatient } from "../services/queueService.js";
import { getQueueAppointments } from "../services/queueService.js";
import { getTodayQueue } from "../services/queueService.js";


export const next = async (req, res) => {
  try {
    const { queueId } = req.params;

    const data = await nextPatient({ queueId });

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



export const getAppointments = async (req, res) => {
  try {
    const { queueId } = req.params;
    const { status } = req.query;

    const data = await getQueueAppointments({ queueId, status });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getToday = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const clinicId = req.user.clinicId;

    const queue = await getTodayQueue({ clinicId, doctorId });

    res.status(200).json({
      success: true,
      data: queue,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};