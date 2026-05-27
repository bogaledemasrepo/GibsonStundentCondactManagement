import { db } from "../db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { staff } from "../db/schema";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.select().from(staff).where(eq(staff.email, email)).limit(1);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user.id, fullName: user.fullName, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};