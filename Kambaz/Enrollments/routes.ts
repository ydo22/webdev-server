import type { Express, Request, Response } from "express";
import EnrollmentsDao from "./dao";
import type { Database } from "../Database";

// §5.4.8 Enrollments (on your own). A userId of "current" means the
// signed-in user from the session, the same as in the course routes.
export default function EnrollmentRoutes(app: Express, db: Database) {
  const dao = EnrollmentsDao(db);

  const resolveUserId = (req: Request<{ userId: string }>, res: Response) => {
    const { userId } = req.params;
    if (userId !== "current") return userId;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return undefined;
    }
    return currentUser._id as string;
  };

  const enrollUserInCourse = (
    req: Request<{ userId: string; courseId: string }>,
    res: Response,
  ) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    dao.enrollUserInCourse(userId, req.params.courseId);
    res.sendStatus(200);
  };
  const unenrollUserFromCourse = (
    req: Request<{ userId: string; courseId: string }>,
    res: Response,
  ) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    dao.unenrollUserFromCourse(userId, req.params.courseId);
    res.sendStatus(200);
  };
  const findUsersForCourse = (req: Request<{ courseId: string }>, res: Response) => {
    res.json(dao.findUsersForCourse(req.params.courseId));
  };

  app.post("/api/users/:userId/courses/:courseId", enrollUserInCourse);
  app.delete("/api/users/:userId/courses/:courseId", unenrollUserFromCourse);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
}
