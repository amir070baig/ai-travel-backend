import { Request, Response } from "express";
import { registerUser } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await registerUser(email, password);

  res.json(user);
};


import { loginUser } from "./auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const data = await loginUser(email, password);

    res.json(data);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};