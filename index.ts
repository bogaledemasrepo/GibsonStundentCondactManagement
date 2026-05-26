import express from "express";
import { db } from "./db";
import { users } from "./db/schema";

const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
  const allUsers = await db.select().from(users);
  res.json(allUsers);
});

app.listen(3000, () => {
  console.log(`Server running on ${process.env.HOST||"http://localhost:3000"}`);
});
