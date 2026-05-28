import express from "express";
import { loginUser } from "./routes/auth";
import { getStudents, registerStudents } from "./routes/student";
import { getStuffs, registerStuff } from "./routes/stuff";
import { addCondacts, getCondacts, getStudentAnalysis, getStudentCondacts } from "./routes/condact";
import { protect } from "./middleware";

const app = express();
app.use(express.json());

app.post("/api/v1/login", loginUser);

app.get("/api/v1/students/paged",protect,getStudents)
app.post("/api/v1/students",protect,registerStudents)

app.get("/api/v1/stuffs/paged",protect,getStuffs)
app.post("/api/v1/stuffs",protect,registerStuff)

app.get("/api/v1/condacts/paged",protect,getCondacts)
app.post("/api/v1/condact",protect,addCondacts)
app.get("/api/v1/condact/:studentID",protect,getStudentCondacts)
app.get("/api/v1/condact-analysis",protect,getStudentAnalysis)

app.listen(3000, () => {
  console.log(`Server running on ${process.env.HOST||"http://localhost:3000"}`);
});
