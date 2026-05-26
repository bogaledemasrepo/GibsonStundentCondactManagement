CREATE TYPE "public"."format_given" AS ENUM('Behavioral', 'Disruptive', 'Referral');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('Admin', 'Teacher');--> statement-breakpoint
CREATE TABLE "conduct_formats" (
	"id" serial PRIMARY KEY NOT NULL,
	"teacher_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"format_given" "format_given" NOT NULL,
	"case_description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" varchar(256) NOT NULL,
	"role" "roles" DEFAULT 'Teacher' NOT NULL,
	CONSTRAINT "staff_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" varchar(256) NOT NULL,
	"grade" varchar(50) NOT NULL,
	"section" varchar(50) NOT NULL,
	"academic_year" varchar(20) NOT NULL,
	CONSTRAINT "students_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "conduct_formats" ADD CONSTRAINT "conduct_formats_teacher_id_staff_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conduct_formats" ADD CONSTRAINT "conduct_formats_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;