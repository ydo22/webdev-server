import "dotenv/config";
import express from "express";
import cors from "cors";
import session, { type SessionOptions } from "express-session";
import Hello from "./Hello";
import Lab5 from "./Lab5/index";
import db from "./Kambaz/Database";
import UserRoutes from "./Kambaz/Users/routes";
import CourseRoutes from "./Kambaz/Courses/routes";
import ModuleRoutes from "./Kambaz/Modules/routes";
import AssignmentRoutes from "./Kambaz/Assignments/routes";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes";

const app = express();

// Cookies need credentials: true and an explicit origin (no "*").
// CLIENT_URL may list several origins separated by commas, e.g. the Vercel
// production URL and the a5 branch URL.
const clientUrls = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);
app.use(
  cors({
    credentials: true,
    origin: clientUrls.length === 1 ? clientUrls[0] : clientUrls,
  }),
);

const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}
app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app, db);
CourseRoutes(app, db);
ModuleRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentRoutes(app, db);
Lab5(app);
Hello(app);

app.listen(process.env.PORT || 4000);
