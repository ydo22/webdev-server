import { v4 as uuidv4 } from "uuid";
import type { Database } from "../Database";

export default function EnrollmentsDao(db: Database) {
  function isEnrolled(userId: string, courseId: string) {
    return db.enrollments.some(
      (enrollment) => enrollment.user === userId && enrollment.course === courseId,
    );
  }
  function enrollUserInCourse(userId: string, courseId: string) {
    if (isEnrolled(userId, courseId)) return;
    db.enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
  }
  function unenrollUserFromCourse(userId: string, courseId: string) {
    db.enrollments = db.enrollments.filter(
      (enrollment) =>
        !(enrollment.user === userId && enrollment.course === courseId),
    );
  }
  function findUsersForCourse(courseId: string) {
    const userIds = db.enrollments
      .filter((enrollment) => enrollment.course === courseId)
      .map((enrollment) => enrollment.user);
    return db.users.filter((user) => userIds.includes(user._id));
  }
  return { isEnrolled, enrollUserInCourse, unenrollUserFromCourse, findUsersForCourse };
}
