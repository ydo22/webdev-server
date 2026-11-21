import type { Express, Request, Response } from "express";
import ModulesDao from "./dao";
import type { Database } from "../Database";

export default function ModuleRoutes(app: Express, db: Database) {
  const dao = ModulesDao(db);

  const findModulesForCourse = (req: Request<{ courseId: string }>, res: Response) => {
    const { courseId } = req.params;
    res.json(dao.findModulesForCourse(courseId));
  };
  const createModuleForCourse = (req: Request<{ courseId: string }>, res: Response) => {
    const { courseId } = req.params;
    const module = { ...req.body, course: courseId };
    const newModule = dao.createModule(module);
    res.json(newModule);
  };
  const deleteModule = (req: Request<{ moduleId: string }>, res: Response) => {
    const { moduleId } = req.params;
    dao.deleteModule(moduleId);
    res.sendStatus(200);
  };
  const updateModule = (req: Request<{ moduleId: string }>, res: Response) => {
    const { moduleId } = req.params;
    const status = dao.updateModule(moduleId, req.body);
    if (!status) {
      res.status(404).json({ message: `Unable to update module with ID ${moduleId}` });
      return;
    }
    res.json(status);
  };

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.put("/api/modules/:moduleId", updateModule);
  app.delete("/api/modules/:moduleId", deleteModule);
}
