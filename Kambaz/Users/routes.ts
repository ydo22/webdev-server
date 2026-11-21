import type { Express, Request, Response } from "express";
import UsersDao from "./dao";
import type { Database } from "../Database";

export default function UserRoutes(app: Express, db: Database) {
  const dao = UsersDao(db);

  // --- Account (§5.4.2–5.4.3): the signed-in user lives in the session ---
  const signin = (req: Request, res: Response) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };
  const signup = (req: Request, res: Response) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const profile = (req: Request, res: Response) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };
  const signout = (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  };
  const updateUser = (req: Request<{ userId: string }>, res: Response) => {
    const { userId } = req.params;
    const updatedUser = dao.updateUser(userId, req.body);
    if (!updatedUser) {
      res.status(404).json({ message: `Unable to update user with ID ${userId}` });
      return;
    }
    // Keep the session in sync when users edit their own profile.
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = updatedUser;
    }
    res.json(updatedUser);
  };

  // --- People table (§5.4.9, optional) ---
  const findAllUsers = (req: Request, res: Response) => {
    res.json(dao.findAllUsers());
  };
  const findUserById = (req: Request<{ userId: string }>, res: Response) => {
    const user = dao.findUserById(req.params.userId);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.json(user);
  };
  const createUser = (req: Request, res: Response) => {
    res.json(dao.createUser(req.body));
  };
  const deleteUser = (req: Request<{ userId: string }>, res: Response) => {
    dao.deleteUser(req.params.userId);
    res.sendStatus(200);
  };

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  // "profile" must be registered before "/api/users/:userId".
  app.get("/api/users/profile", profile);
  app.get("/api/users", findAllUsers);
  app.post("/api/users", createUser);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
}
