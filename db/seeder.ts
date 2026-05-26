import { db } from ".";
import { staff, students, conductFormats } from "./schema"; // Adjust this path to your schema file

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Clear existing data (Optional, but highly recommended for fresh seeds)
    // We delete in reverse order of relationships to avoid foreign key violations
    console.log("🧹 Clearing old data...");
    await db.delete(conductFormats);
    await db.delete(students);
    await db.delete(staff);

    // 2. Insert Staff (Teachers and Admins)
    console.log("👥 Inserting staff members...");
    const insertedStaff = await db.insert(staff).values([
      { fullName: "Abebe Kebede", email: "abebe.k@school.com", role: "Teacher" },
      { fullName: "Marta Alemu", email: "marta.a@school.com", role: "Teacher" },
      { fullName: "Dawit Yohannes", email: "dawit.y@school.com", role: "Admin" },
    ]).returning({ id: staff.id });

    // 3. Insert Students
    console.log("🎓 Inserting students...");
    const insertedStudents = await db.insert(students).values([
      { 
        fullName: "Chala Bekele", 
        email: "chala.b@student.com", 
        grade: "Grade 9", 
        section: "A", 
        academicYear: "2025/2026" 
      },
      { 
        fullName: "Elena Tadesse", 
        email: "elena.t@student.com", 
        grade: "Grade 10", 
        section: "B", 
        academicYear: "2025/2026" 
      },
      { 
        fullName: "Samuel Yohannes", 
        email: "samuel.y@student.com", 
        grade: "Grade 9", 
        section: "A", 
        academicYear: "2025/2026" 
      },
    ]).returning({ id: students.id });

    // 4. Insert Conduct/Behavioral Formats
    // We grab IDs dynamically from the previous steps so they match correctly
    console.log("📝 Inserting conduct logs...");
    await db.insert(conductFormats).values([
      {
        teacherId: insertedStaff[0]!.id, // Abebe
        studentId: insertedStudents[0]!.id, // Chala
        formatGiven: "Behavioral",
        caseDescription: "Student was late to class 3 times this week without a valid excuse.",
      },
      {
        teacherId: insertedStaff[1]!.id, // Marta
        studentId: insertedStudents[1]!.id, // Elena
        formatGiven: "Disruptive",
        caseDescription: "Talking loudly and using a phone during the midterm math examination.",
      },
      {
        teacherId: insertedStaff[0]!.id, // Abebe
        studentId: insertedStudents[2]!.id, // Samuel
        formatGiven: "Referral",
        caseDescription: "Skipped afternoon classes completely. Recommending a parent-teacher meeting.",
      }
    ]);

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}

seed();