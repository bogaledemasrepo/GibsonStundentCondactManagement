import { db } from "../db";
import bcrypt from "bcryptjs";
import type { AuthRequest } from "../middleware";
import { staff } from "../db/schema";
import type { Response } from "express";

export const getStuffs = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    // Exclude password from the query for security
    const data = await db.select({
      id: staff.id,
      fullName: staff.fullName,
      email: staff.email,
      role: staff.role
    }).from(staff).limit(limit).offset(offset);

    res.json({ page, limit, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const registerStuff = async (req: AuthRequest, res: Response) => {
  // Only Admins should be allowed to create staff
  if (req.user?.role !== "Admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  const { fullName, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newStaff] = await db.insert(staff).values({
      fullName,
      email,
      password: hashedPassword,
      role
    }).returning({ id: staff.id, fullName: staff.fullName, email: staff.email, role: staff.role });

    res.status(201).json(newStaff);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};