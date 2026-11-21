import { v4 as uuidv4 } from "uuid";
import type { Database } from "../Database";

export default function AssignmentsDao(db: Database) {
  const findAssignmentsForCourse = (courseId: string) =>
    db.assignments.filter((assignment) => assignment.course === courseId);
  const createAssignment = (assignment: any) => {
    const created = { ...assignment, _id: uuidv4() };
    db.assignments = [...db.assignments, created];
    return created;
  };
  const updateAssignment = (assignmentId: string, updates: any) => {
    const assignment = db.assignments.find((item) => item._id === assignmentId);
    if (!assignment) return undefined;
    Object.assign(assignment, updates, { _id: assignmentId });
    return assignment;
  };
  const deleteAssignment = (assignmentId: string) => {
    db.assignments = db.assignments.filter((item) => item._id !== assignmentId);
  };
  return {
    findAssignmentsForCourse,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
