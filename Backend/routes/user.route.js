import express from "express";
import { uploadImage } from "../utils/multer.js";

import {
  registerUser,
  loginUSer,
  logOut,
  refreshToken,
  getUserProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  enrollCourse,
  updateCourseProgress,
  deactivateAccount,
  deleteAccount,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAuthorized from "../middleware/isAuthorized.js";

const router = express.Router();

// Public routes

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUSer);
router.post("/refresh-token", refreshToken);
router.get("/verify-email/:token", verifyEmail);

// Password management
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/profile", isAuthenticated, getUserProfile);
router.put(
  "/profile",
  isAuthenticated,
  uploadImage.single("profilePhoto"),
  updateProfile
);

// Auth & Security
router.post("/logout", isAuthenticated, logOut);
router.put("/change-password", isAuthenticated, changePassword);

// Course management for students
router.post("/enroll-course", isAuthenticated, enrollCourse);
router.put("/course-progress", isAuthenticated, updateCourseProgress);

// Account management
router.put("/deactivate", isAuthenticated, deactivateAccount);
router.delete("/delete-account", isAuthenticated, deleteAccount);

// Admin routes -> Admins only

// User management
router.get("/admin/users", isAuthenticated, isAuthorized("Admin"), getAllUsers);

router.put(
  "/admin/user/:userId/role",
  isAuthenticated,
  isAuthorized("Admin"),
  updateUserRole
);

router.patch(
  "/admin/user/:userId/toggle-status",
  isAuthenticated,
  isAuthorized("Admin"),
  toggleUserStatus
);

export default router;
