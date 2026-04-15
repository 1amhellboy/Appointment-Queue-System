import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Clinic from "../models/Clinic.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async ({ clinicName, phone, password, name }) => {
  // 1. Check if user exists
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // 2. Create clinic
  const clinic = await Clinic.create({
    name: clinicName,
    phone,
  });

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Create user
  const user = await User.create({
    clinicId: clinic._id,
    name,
    phone,
    password: hashedPassword,
  });

  // 5. Generate token
  const token = generateToken(user._id);

  return { user, token };
};

export const loginUser = async ({ phone, password }) => {
  const user = await User.findOne({ phone });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);

  return { user, token };
};