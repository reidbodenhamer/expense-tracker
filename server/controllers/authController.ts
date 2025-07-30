import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/User";

const generateToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET as string;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return jwt.sign({ id }, jwtSecret, { expiresIn: "1h" });
};

import { Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

interface RegisterRequestBody {
  fullName: string;
  email: string;
  password: string;
  profileImageUrl?: string;
}

export const registerUser = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser: UserDocument | null = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user: UserDocument = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      id: user._id,
      user: userObj,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error registering user", error: errorMessage });
  }
};

interface LoginRequestBody {
  email: string;
  password: string;
}

export const loginUser = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user: UserDocument | null = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      id: user._id,
      user: userObj,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error logging in user", error: errorMessage });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const user: UserDocument | null = await User.findById(req.user?._id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json({ message: "Error getting user info", error: errorMessage });
  }
};

export const protect = (req: Request, res: Response, next: Function) => {};
