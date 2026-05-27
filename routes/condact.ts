import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import type { AuthRequest } from "../middleware";
import type { Response } from "express";
import { conductFormats, students } from "../db/schema";

export const addCondacts = async (req: AuthRequest, res: Response) => {
  const { studentId, formatGiven, caseDescription } = req.body;
  const teacherId = req.user?.id; // Automatically grabbed from JWT payload

  if (!teacherId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const [newConduct] = await db.insert(conductFormats).values({
      teacherId,
      studentId,
      formatGiven,
      caseDescription
    }).returning();

    res.status(201).json(newConduct);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCondacts = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const data = await db.select().from(conductFormats).limit(limit).offset(offset);
    res.json({ page, limit, data });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getStudentCondacts = async (req: AuthRequest, res: Response) => {
//   const studentId = parseInt(req.params.studentID);

//   try {
//     const data = await db.select().from(conductFormats).where(eq(conductFormats.studentId, studentId));
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
res.status(500).json({ error: "Unknown error...!" });
};

export const getStudentAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    // Generates counts grouped by format types per student
    const analysis = await db
      .select({
        studentId: conductFormats.studentId,
        studentName: students.fullName,
        format: conductFormats.formatGiven,
        count: sql<number>`count(${conductFormats.id})`.mapWith(Number),
      })
      .from(conductFormats)
      .leftJoin(students, eq(conductFormats.studentId, students.id))
      .groupBy(conductFormats.studentId, students.fullName, conductFormats.formatGiven);

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};