import type { Express, Request, Response } from "express";
import AssignmentsDao from "./dao";
import type { Database } from "../Database";

export default function AssignmentRoutes(app: Express, db: Database) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = (req: Request<{ courseId: string }>, res: Response) => {
    res.json(dao.findAssignmentsForCourse(req.params.courseId));
  };
  const createAssignmentForCourse = (req: Request<{ courseId: string }>, res: Response) => {
    const created = dao.createAssignment({
      ...req.body,
      course: req.params.courseId,
    });
    res.json(created);
  };
  const updateAssignment = (req: Request<{ assignmentId: string }>, res: Response) => {
    const { assignmentId } = req.params;
    const updated = dao.updateAssignment(assignmentId, req.body);
    if (!updated) {
      res.status(404).json({ message: `Unable to update assignment with ID ${assignmentId}` });
      return;
    }
    res.json(updated);
  };
  const deleteAssignment = (req: Request<{ assignmentId: string }>, res: Response) => {
    dao.deleteAssignment(req.params.assignmentId);
    res.sendStatus(200);
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}
