import User from "../models/user.model.js";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

// Generate jwt token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Generate refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
};

// Register a new user
export const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Check if user already exists
    const userExist = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (userExist) {
      return res.status(400).json({
        message: "User already exist",
        success: false,
      });
    }

    // validate role
    const validateRoles = ["Student", "Teacher", "Admin"];
    if (role && !validateRoles.includes(role)) {
      return res.status(400).json({
        message: "Inavalid role. Must be Student, Teacher or Admin",
        success: false,
      });
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 12);

    // email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "Student",
      emailVerificationToken,
    });

    // Generate token
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // set refresh token as httponly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Error while registering user",
      success: false,
    });
  }
};

// Login user
export const loginUSer = async (req, res) => {
  const { email, password } = req.body;
  try {
    // check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
        success: false,
      });
    }

    // find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        message: "Your account has been deactivated. Please contact support",
      });
    }

    // verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Generate token
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // set refresh token as httOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      message: "Login Successful",
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        photoUrl: user.photoUrl,
      },
      token,
    });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({
      message: "Error while logging in",
      success: false,
    });
  }
};

// Logout User
export const logOut = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Logout error", error);
    return res.status(500).json({
      message: "Failed to logout",
      succeess: false,
    });
  }
};

// Refrsh access token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
        success: false,
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
        success: false,
      });
    }

    const newAccessToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error", error);
    return res.status(500).json({
      message: "Invalid refresh token",
      success: false,
    });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "enrolledCourses.courseId",
        select: "title description thumbnail instructor",
      })
      .populate({
        path: "createdCourses",
        select: "title description thumbnail studentsCount",
      });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error while fetching user profile", error);
    return res.status(500).json({
      message: "failed to load user profile",
      success: false,
    });
  }
};

// update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user?.id || req.id;
    if (!userId)
      return res
        .status(401)
        .json({ message: "Unauthorized access", success: false });

    const { username, bio } = req.body;

    // Parse socialLinks safely
    let socialLinks;
    try {
      socialLinks =
        typeof req.body.socialLinks === "string"
          ? JSON.parse(req.body.socialLinks)
          : req.body.socialLinks;
    } catch (error) {
      socialLinks = req.body.socialLinks;
    }

    const profilePhoto = req.file;

    // Find User
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    // Check if username is taken
    if (username && username !== user.username) {
      const exists = await User.findOne({ username });
      if (exists)
        return res
          .status(400)
          .json({ message: "Username already taken", success: false });
    }

    let photoUrl = user.photoUrl;

    // Handle profile photo upload
    if (profilePhoto) {
      console.log("Uploading file:", profilePhoto.path);
      // Delete old photo if exists
      if (user.photoUrl) {
        const publicId = user.photoUrl.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }

      // Upload new photo
      const cloudResponse = await uploadMedia(profilePhoto.path);
      if (!cloudResponse || !cloudResponse.secure_url) {
        return res.status(500).json({
          message: "Failed to upload profile photo",
          success: false,
        });
      }
      photoUrl = cloudResponse.secure_url;
    }

    // Prepare update data
    const updateData = {};
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (photoUrl !== user.photoUrl) updateData.photoUrl = photoUrl;
    if (socialLinks) updateData.socialLinks = socialLinks;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error while updating profile:", error);
    return res.status(500).json({
      message: "Failed to update profile",
      success: false,
      error: error.message,
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "current password and new password required",
        success: false,
      });
    }

    // find user with password
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "current password is incorrect",
        success: false,
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // update password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error", error);
    return res.status(500).json({
      message: "Failed to change password",
      success: false,
    });
  }
};

// forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "No user found with this email",
        success: false,
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // save reset token to user
    user.passwordresetToken = resetToken;
    user.passwordResetExpires = resetTokenExpires;
    await user.save();

    // Send password reset email
    // await sendPasswordResetEmail(user.email, resetToken)

    res.status(200).json({
      message: "password reset link set to your email",
      success: true,
    });
  } catch (error) {
    console.error("Forgot password error", error);
    res.status(500).json({
      message: "Failed to process forgot password request",
      success: false,
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required",
        success: false,
      });
    }

    const user = await User.findOne({
      passwordresetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
        success: false,
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset token
    user.password = hashedPassword;
    (user.passwordresetToken = undefined),
      (user.passwordResetExpires = undefined);
    await user.save();

    res.status(200).json({
      message: "password reset successfully",
      success: true,
    });
  } catch (error) {
    console.error("Reset password error", error);
    res.status(500).json({
      message: "failed to reset password",
      success: false,
    });
  }
};

// verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({
        message: "Invalid verification token",
        success: false,
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Email verfication error", error);
    res.status(500).json({
      message: "Failed to verify email",
      success: false,
    });
  }
};

// Enroll in course
export const enrollCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if already enrolled
    const isEnrolled = user.enrolledCourses.some(
      (course) => course.courseId.toString() === courseId
    );

    if (isEnrolled) {
      return res.status(400).json({
        message: "Already enrolled in this course",
        success: false,
      });
    }

    // add course to enrolled courses
    user.enrolledCourses.push({
      courseId,
      enrolledAt: new Date(),
      progress: 0,
    });

    await user.save();

    res.status(200).json({
      message: "Successfully enrolled in course",
      success: true,
    });
  } catch (error) {
    console.error("Course enrollmet error", error);
    res.status(500).json({
      message: "failed to enroll in course",
      success: false,
    });
  }
};

// update course progress
export const updateCourseProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, progress } = req.body;

    if (!courseId || progress === undefined) {
      return res.status(400).json({
        message: "Course ID and progress are required",
        success: false,
      });
    }

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        message: "Progress must be between 0 and 100",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Find and update course
    const courseIndex = user.enrollCourse.findIndex(
      (course) => course.courseId.toString() === courseId
    );

    if (courseIndex === -1) {
      return res.status(400).json({
        message: "Not enrolled in this course",
        success: false,
      });
    }

    user.enrolledCourses[courseIndex].progress = progress;
    await user.save();

    res.status(200).json({
      message: "Course progress updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Update progress error", error);
    res.status(500).json({
      message: "Failed to update course progress",
      success: false,
    });
  }
};

// Deactivate account
export const deactivateAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Account deactivated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Deactivated account error", error);
    res.status(500).json({
      message: "Failed to deactivate account",
      success: false,
    });
  }
};

// Delete account permanent
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    if (!password) {
      return res.status(404).json({
        message: "Password is required to delete account",
        success: false,
      });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }

    // Delete profile photo from cloudinary if exist
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Account deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Delete account error", error);
    res.status(500).json({
      message: "Failed to delete account",
      success: false,
    });
  }
};

// Admin : Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const users = await User.find(filter)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get all users errors", error);
    res.status(500).json({
      message: "Failed to fetch users",
      success: false,
    });
  }
};

// Admin: Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.params;

    const validRoles = ["Student", "Teacher", "Admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
        success: false,
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User role updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update user role error", error);
    res.status(500).json({
      message: "Failed to update user role",
      success: false,
    });
  }
};

// Admin: Toggle user active status
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle user status error:", error);
    res.status(500).json({
      message: "Failed to update user status",
      success: false,
    });
  }
};
