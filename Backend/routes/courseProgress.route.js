import express from "express";
import {
  bulkUpdateLectureProgress,
  createOrUpdateCourseProgress,
  deleteCourseProgress,
  getCourseProgress,
  getCourseStatistics,
  getUserCourseProgress,
  markCourseComplete,
  resetCourseProgress,
  updateLectureProgress,
} from "../controllers/courseProgress.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAuthorized from "../middleware/isAuthorized.js";

const router = express.Router();

// Student routes => Authenticatd students

// Create or initialize course progress when student enrolls
router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Student"),
  createOrUpdateCourseProgress
);

// Get specific course progress for a user
router.get(
  "/:userId/:courseId",
  isAuthenticated,
  isAuthorized("Student", "Teacher", "Admin"),
  getCourseProgress
);

// Get all course progress for logged-in user
router.get(
  "/user/:userId",
  isAuthenticated,
  isAuthorized("Student", "Teacher", "Admin"),
  getUserCourseProgress
);

// Update single lecture progress => when student watches a lecture
router.put(
  "/:userId/:courseId/lecture/:lectureId",
  isAuthenticated,
  isAuthorized("Student"),
   updateLectureProgress
);

// Bulk update multiple lectures progress => for video player
router.put(
  "/:userId/:courseId/bulk-update",
  isAuthenticated,
  isAuthorized("Student"),
  bulkUpdateLectureProgress
);

// Mark entire course as completed
router.patch(
  "/:userId/:courseId/complete",
  isAuthenticated,
  isAuthorized("Student"),
  markCourseComplete
);

// Reset course progress => start over
router.patch(
  "/:userId/:courseId/reset",
  isAuthenticated,
  isAuthorized("Student", "Admin"),
  resetCourseProgress
);

// Delete course progress
router.delete(
  "/:userId/:courseId",
  isAuthenticated,
  isAuthorized("Student", "Admin"),
  deleteCourseProgress
);

// Teacher / Admin routes => Course statistics

// Get course statistics => For course creator or admin
router.get(
  "/stats/:courseId",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  getCourseStatistics
);

// Bulk update
router.put(
  "/:userId/:courseId/bulk-update",
  isAuthenticated,
  bulkUpdateLectureProgress
);

export default router;
