import { v4 as uuidv4 } from "uuid";
import type { Database } from "../Database";

export default function CoursesDao(db: Database) {
  function findAllCourses() {
    return db.courses;
  }
  function findCourseById(courseId: string) {
    return db.courses.find((course) => course._id === courseId);
  }
  function findCoursesForEnrolledUser(userId: string) {
    const { courses, enrollments } = db;
    return courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id,
      ),
    );
  }
  function createCourse(course: any) {
    const newCourse = { ...course, _id: uuidv4() };
    db.courses = [...db.courses, newCourse];
    return newCourse;
  }
  function deleteCourse(courseId: string) {
    const { courses, enrollments } = db;
    db.courses = courses.filter((course) => course._id !== courseId);
    db.enrollments = enrollments.filter(
      (enrollment) => enrollment.course !== courseId,
    );
  }
  function updateCourse(courseId: string, courseUpdates: any) {
    const course = findCourseById(courseId);
    if (!course) return undefined;
    Object.assign(course, courseUpdates, { _id: courseId });
    return course;
  }
  return {
    findAllCourses,
    findCourseById,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
