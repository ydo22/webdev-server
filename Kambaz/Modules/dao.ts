import { v4 as uuidv4 } from "uuid";
import type { Database } from "../Database";

export default function ModulesDao(db: Database) {
  function findModulesForCourse(courseId: string) {
    const { modules } = db;
    return modules.filter((module) => module.course === courseId);
  }
  function createModule(module: any) {
    const newModule = { ...module, _id: uuidv4() };
    db.modules = [...db.modules, newModule];
    return newModule;
  }
  function deleteModule(moduleId: string) {
    const { modules } = db;
    db.modules = modules.filter((module) => module._id !== moduleId);
  }
  function updateModule(moduleId: string, moduleUpdates: any) {
    const { modules } = db;
    const module = modules.find((module) => module._id === moduleId);
    if (!module) return undefined;
    Object.assign(module, moduleUpdates, { _id: moduleId });
    return module;
  }
  return { findModulesForCourse, createModule, deleteModule, updateModule };
}
