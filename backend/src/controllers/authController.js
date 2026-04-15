import { registerUser, loginUser } from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const { clinicName, phone, password, name } = req.body;

    const data = await registerUser({
      clinicName,
      phone,
      password,
      name,
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

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const data = await loginUser({ phone, password });

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