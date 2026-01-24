import express from "express";
import {uploadVideo} from "../utils/multer.js";

import {
  createLecture,
  getAllLectures,
  getLectureById,
  getLecturesByCourseId,
  getPreviewLectures,
  updateLectures,
  deleteLectures,
  reorderLecture,
  getLectureStats,
  togglePreviewStatus,
} from "../controllers/lecture.controller.js";

import isAuthenticated from "../middleware/isAuthenticated.js";
import isAuthorized from "../middleware/isAuthorized.js";

const router = express.Router();

// Public routes
router.get("/course/:courseId/preview", getPreviewLectures);

// Student routes => Authenticatd and enrolled
router.get(
  "/course/:courseId",
  isAuthenticated,
  isAuthorized("Student", "Teacher", "Admin"),
  getLecturesByCourseId
);

// Get single lecture by ID => enrolled student only
router.get(
  "/:id",
  isAuthenticated,
  isAuthorized("Student", "Teacher", "Admin"),
  getLectureById
);

// Teacher routes => course owners and admins

// creates a new lecture
router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  uploadVideo.single("video"),
  createLecture
);

// Get all lectures => for admin/teacher dashboard
router.get(
  "/",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  getAllLectures
);

// Update lecture
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  uploadVideo.single("video"),
  updateLectures
);

// Delete course
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  deleteLectures
);

// Reorder lectures within a course
router.put(
  "/course/:courseId/reorder",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  reorderLecture
);

// Toggle lecture preview free status
router.patch(
  "/:id/toggle-preview",
  isAuthenticated,
  isAuthorized("Teacher", "Admin"),
  togglePreviewStatus
);

// Admin routes

// Get lecture statistics
router.get(
  "/admin/stats",
  isAuthenticated,
  isAuthorized("Admin"),
  getLectureStats
);

export default router;
