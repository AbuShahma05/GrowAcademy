import express from "express";
import {uploadImage} from "../utils/multer.js"

import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  togglePublishCourse,
  enrollInCourse,
  getEnrolledCourse,
  getCreatedCourse,
  updateCourseProgress,
  getCourseStats,
} from "../controllers/course.controller.js";

import isAuthenticated from "../middleware/isAuthenticated.js";
import isAuthorized from "../middleware/isAuthorized.js";
import isCourseOwner from "../middleware/isCourseOwner.js";

const router = express.Router();

// Pulic routes
router.get("/", getAllCourses);

// Get single course by id
router.get("/:id", getCourseById);

router.get("/created", isAuthenticated, getCreatedCourse)

// Get all enrolled courses for logged-in student
router.get(
  "/student/enrolled",
  isAuthenticated,
  isAuthorized("Student"),
  getEnrolledCourse
);

// Student Routes, Enroll in a course
router.post(
  "/:id/enroll",
  isAuthenticated,
  isAuthorized("Student"),
  enrollInCourse
);

// Update course progress
router.put(
  "/:id/progress",
  isAuthenticated,
  isAuthorized("Student"),
  updateCourseProgress
);

// Teacher Routes

// Create a new course
router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  uploadImage.single("courseThumbnail"),
  createCourse
);

// Get all courses created by logged-in teacher
router.get(
  "/teacher/created",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  getCreatedCourse
);

// Create a new course
router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  createCourse
);

// Update course -> only course owner or admin
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  isCourseOwner,
  updateCourse
);

// Delete course -> only course owner or admin
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  isCourseOwner,
  deleteCourse
);

// Toggle publish/unpublish course
router.patch(
  "/:id/publish",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  isCourseOwner,
  togglePublishCourse
);

// Get course statistics -> only for course creator or admin
router.get(
  "/:id/stats",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  isCourseOwner,
  getCourseStats
);

router.get("/:id", getCourseById);

export default router;
