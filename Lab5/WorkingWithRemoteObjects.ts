import type { Express, Request, Response } from "express";

const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};

const module = {
  id: "M101",
  name: "Introduction to Node.js",
  description: "Learn how to build HTTP servers with Node.js and Express",
  course: "RS101",
};

export default function WorkingWithRemoteObjects(app: Express) {
  const getAssignment = (req: Request, res: Response) => {
    res.json(assignment);
  };
  const getAssignmentTitle = (req: Request, res: Response) => {
    res.json(assignment.title);
  };
  const setAssignmentTitle = (req: Request<{ newTitle: string }>, res: Response) => {
    const { newTitle } = req.params;
    assignment.title = newTitle;
    res.json(assignment);
  };
  const setAssignmentScore = (req: Request<{ newScore: string }>, res: Response) => {
    const { newScore } = req.params;
    assignment.score = parseInt(newScore);
    res.json(assignment);
  };
  const setAssignmentCompleted = (req: Request<{ completed: string }>, res: Response) => {
    const { completed } = req.params;
    assignment.completed = completed === "true";
    res.json(assignment);
  };

  const getModule = (req: Request, res: Response) => {
    res.json(module);
  };
  const getModuleName = (req: Request, res: Response) => {
    res.json(module.name);
  };
  const setModuleName = (req: Request<{ newName: string }>, res: Response) => {
    const { newName } = req.params;
    module.name = newName;
    res.json(module);
  };
  const setModuleDescription = (req: Request<{ newDescription: string }>, res: Response) => {
    const { newDescription } = req.params;
    module.description = newDescription;
    res.json(module);
  };

  app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);
  app.get("/lab5/assignment/title", getAssignmentTitle);
  app.get("/lab5/assignment/score/:newScore", setAssignmentScore);
  app.get("/lab5/assignment/completed/:completed", setAssignmentCompleted);
  app.get("/lab5/assignment", getAssignment);

  app.get("/lab5/module/name/:newName", setModuleName);
  app.get("/lab5/module/description/:newDescription", setModuleDescription);
  app.get("/lab5/module/name", getModuleName);
  app.get("/lab5/module", getModule);
}
