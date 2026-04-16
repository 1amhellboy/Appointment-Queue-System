import { nextPatient } from "../services/queueService.js";

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