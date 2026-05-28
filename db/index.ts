import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Log this during debugging to make sure it's not undefined or malformed
console.log("Connecting to:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  connectionTimeoutMillis: 5000, // Optional: Fails faster (5s) instead of hanging
});

export const db = drizzle(pool);
