import express from "express";
import {
  createCoursePurchase,
  getAllCoursePurchases,
  getCoursePurchaseByUserId,
  updateCoursePurchaseStatus,
  deleteCoursePurchase,
  getCoursePurchaseStats,
  verifyCourseAccess,
  getMyEnrolledCourses
} from "../controllers/coursePurchase.controller.js";

import isAuthenticated from "../middleware/isAuthenticated.js";
import isAuthorized from "../middleware/isAuthorized.js";

const router = express.Router();

// Student Routes => Authenticated students

// Create a new course purchase => intiate payment
router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Student"),
  createCoursePurchase
);

// Get logged-in user's purchase histroy
router.get(
  "/my-purchase",
  isAuthenticated,
  isAuthorized("Student", "Teacher", "Admin"),
  getCoursePurchaseByUserId
);

// Verify if user has access to a course
router.get("/verify/:courseId/:userId", isAuthenticated, verifyCourseAccess);

// Get single purchase by ID => user can view their own purchase
router.get("/:id", isAuthenticated, getCoursePurchaseByUserId);

// Teacher routes => for viewing their course sales
router.get(
  "/admin/all",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllCoursePurchases
);

// Get purchases by specific user id
router.get(
  "/admin/user/:userId",
  isAuthenticated,
  isAuthorized("Admin"),
  getCoursePurchaseByUserId
);

// Update purchase status => for payment confirmation/failure
router.get(
  "/admin/:id/status",
  isAuthenticated,
  isAuthorized("Admin"),
  updateCoursePurchaseStatus
);

// Delete purchase course
router.delete(
  "/admin/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteCoursePurchase
);

// Get purchase statistics
router.get(
  "/admin/stats",
  isAuthenticated,
  isAuthorized("Admin"),
  getCoursePurchaseStats
);

router.get(
  "/student/enrolled",
  isAuthenticated,
  isAuthorized("Student"),
  getMyEnrolledCourses
);

export default router;
