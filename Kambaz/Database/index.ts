import courses from "./courses.json";
import modules from "./modules.json";
import assignments from "./assignments.json";
import users from "./users.json";
import enrollments from "./enrollments.json";

// Barrel: the whole in-memory database as one object. DAOs reassign these
// arrays (db.courses = [...]) so every DAO always sees the latest version.
// Changes last until the server restarts; Chapter 6 swaps in MongoDB.
export type Database = {
  courses: any[];
  modules: any[];
  assignments: any[];
  users: any[];
  enrollments: any[];
};

const db: Database = { courses, modules, assignments, users, enrollments };
export default db;
