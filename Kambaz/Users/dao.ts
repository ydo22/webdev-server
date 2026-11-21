import { v4 as uuidv4 } from "uuid";
import type { Database } from "../Database";

export default function UsersDao(db: Database) {
  const findAllUsers = () => db.users;
  const findUserById = (userId: string) =>
    db.users.find((user) => user._id === userId);
  const findUserByUsername = (username: string) =>
    db.users.find((user) => user.username === username);
  const findUserByCredentials = (username: string, password: string) =>
    db.users.find(
      (user) => user.username === username && user.password === password,
    );
  const createUser = (user: any) => {
    const newUser = { ...user, _id: uuidv4() };
    db.users = [...db.users, newUser];
    return newUser;
  };
  const updateUser = (userId: string, userUpdates: any) => {
    db.users = db.users.map((u) =>
      u._id === userId ? { ...u, ...userUpdates, _id: userId } : u,
    );
    return findUserById(userId);
  };
  const deleteUser = (userId: string) => {
    db.users = db.users.filter((u) => u._id !== userId);
    // Drop the user's enrollments too, so no course points at a missing user.
    db.enrollments = db.enrollments.filter((e) => e.user !== userId);
  };
  return {
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    createUser,
    updateUser,
    deleteUser,
  };
}
