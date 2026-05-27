import type { Response } from "express";
import { db } from "../db";
import { students } from "../db/schema";
import type { AuthRequest } from "../middleware";

export const getStudents = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const data = await db.select().from(students).limit(limit).offset(offset);
    res.json({ page, limit, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const registerStudents = async (req: AuthRequest, res: Response) => {
  const { fullName, email, grade, section, academicYear } = req.body;

  try {
    const [newStudent] = await db.insert(students).values({
      fullName,
      email,
      grade,
      section,
      academicYear
    }).returning();

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
