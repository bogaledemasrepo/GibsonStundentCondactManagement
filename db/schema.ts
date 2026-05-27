import { pgEnum, pgTable, serial, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";

// 1. Enum Definitions
export const roleEnum = pgEnum("roles", ["Admin", "Teacher"]);
export const formatGivenEnum = pgEnum("format_given", ["Behavioral", "Disruptive", "Referral"]);

// 2. Staff Table (Fixed typo from 'stuff' to 'staff' for clarity, added role)
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: text("password").notNull(), // Added for auth
  role: roleEnum("role").default("Teacher").notNull(),
});

// 3. Students Table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  grade: varchar("grade", { length: 50 }).notNull(),
  section: varchar("section", { length: 50 }).notNull(),
  academicYear: varchar("academic_year", { length: 20 }).notNull(), // Fixed typo "accadamicYear"
});

// 4. Conduct Formats Table (Handles relationships between Staff and Students)
export const conductFormats = pgTable("conduct_formats", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id")
    .notNull()
    .references(() => staff.id, { onDelete: "cascade" }),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  formatGiven: formatGivenEnum("format_given").notNull(),
  caseDescription: text("case_description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});