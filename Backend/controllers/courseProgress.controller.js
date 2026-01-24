import CourseProgress from "../models/courseProgress.model.js";
import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import mongoose, { mongo } from "mongoose";

// Create or update course progress
export const createOrUpdateCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({
        message: "Course not found",
        success: false,
      });
    }

    // Check if progress already exists
    let courseProgress = await CourseProgress.findOne({ userId, courseId });

    if (courseProgress) {
      return res.status(200).json({
        message: "Course progress already exists",
        success: true,
        data: courseProgress,
      });
    }

    // Get all lectures for this course
    const lectures = await Lecture.find({ courseId });

    //  Create lecture progress array
    const lectureProgress = lectures.map((lecture) => ({
      lectureId: lecture._id,
      viewed: false,
      watchTime: 0,
      completed: false,
    }));

    // Create new course progress
    courseProgress = new CourseProgress({
      userId,
      courseId,
      lectureProgress,
      completionPercentage: 0,
      completed: false,
    });

    await courseProgress.save();

    res.status(201).json({
      message: "course progress created successfully",
      success: true,
      data: courseProgress,
    });
  } catch (error) {
    console.log("Error creating course progress", error);
    res.status(500).json({
      message: "Internal server error while creating course progress",
      success: false,
    });
  }
};

// Get course progress by user and course
export const getCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    if (!userId || !courseId) {
      return res.status(400).json({
        message: "User ID and Course ID are required",
        success: false,
      });
    }

    // Course progress find
    const courseProgress = await CourseProgress.findOne({ userId, courseId })
      .populate("courseId", "title description")
      .populate("lectureProgress.lectureId", "title duration")
      .populate("lastAccessedLecture", "title");

    if (!courseProgress) {
      return res.status(404).json({
        message: "Course progress not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Course progress retrieved successfully",
      success: true,
      data: courseProgress,
    });
  } catch (error) {
    console.error("Error retrieving course progress:", error);
    res.status(500).json({
      message: "Internal server error while retrieving course progress",
    });
  }
};

// Get all course progress for a user
export const getUserCourseProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
      });
    }

    // course progress list
    const courseProgressList = await CourseProgress.find({ userId })
      .populate("courseId", "title description thumbnail")
      .populate("lastAccessedLecture", "title")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "User course progress retrieved successfully",
      success: true,
      data: courseProgressList,
    });
  } catch (error) {
    console.error("Error retrieving user course progress:", error);
    res.status(500).json({
      message: "Internal server error while retrieving user course progress",
      success: false,
    });
  }
};

// Update lecture progress
export const updateLectureProgress = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.params;
    const { viewed, watchTime, completed } = req.body;

    if (!userId || !courseId || !lectureId) {
      return res.status(400).json({
        message: "User ID, Course ID and Lecture ID are required",
      });
    }

    let courseProgress = await CourseProgress.findOne({ userId, courseId });

    if (!courseProgress) {
        const lectures = await Lecture.find({ courseId });

          courseProgress = new CourseProgress({
    userId,
    courseId,
    lectureProgress: lectures.map((lecture) => ({
      lectureId: lecture._id,
      viewed: false,
      watchTime: 0,
      completed: false,
    })),
    completionPercentage: 0,
    completed: false,
  });

  await courseProgress.save();
    }

    // Find and update specific lecture progress
    const lectureProgressIndex = courseProgress.lectureProgress.findIndex(
      (progress) => progress.lectureId.toString() === lectureId
    );

    if (lectureProgressIndex === -1) {
      return res.status(404).json({
        message: "Lecture progress not found",
        success: false,
      });
    }

    // Update lecture progress
    if (viewed !== undefined) {
      courseProgress.lectureProgress[lectureProgressIndex].viewed = viewed;
    }
    if (watchTime !== undefined) {
      courseProgress.lectureProgress[lectureProgressIndex].watchTime =
        watchTime;
    }
    if (completed !== undefined) {
      courseProgress.lectureProgress[lectureProgressIndex].completed =
        completed;
    }

    // Update last accessed lecture
    courseProgress.lastAccessedLecture = lectureId;

    // Calculate completion percentage
    const totalLectures = courseProgress.lectureProgress.length;
    const completedLectures = courseProgress.lectureProgress.filter(
      (progress) => progress.completed
    ).length;

    courseProgress.completionPercentage =
      totalLectures > 0
        ? Math.round((completedLectures / totalLectures) * 100)
        : 0;

    // Check if course is completed
    if (
      courseProgress.completionPercentage === 100 &&
      !courseProgress.completed
    ) {
      courseProgress.completed = true;
      courseProgress.completedAt = new Date();
    }

    await courseProgress.save();

    res.status(200).json({
      message: "Lecture progress updated successfully",
      success: true,
      data: courseProgress,
    });
  } catch (error) {
    console.error("Error updating lecture progress:", error);
    res.status(500).json({
      message: "Internal server error while updating lecture progress",
    });
  }
};

// Mark course as completed
export const markCourseComplete = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    if (!userId || !courseId) {
      return res.status(400).json({
        message: "User ID and Course ID are required",
      });
    }

    const courseProgress = await CourseProgress.findOne({ userId, courseId });

    if (!courseProgress) {
      return res.status(404).json({
        message: "Course progress not found",
        success: false,
      });
    }

    // Mark all lectures as completed
    courseProgress.lectureProgress.forEach((progress) => {
      progress.completed = true;
      progress.viewed = true;
    });

    courseProgress.completed = true;
    courseProgress.completionPercentage = 100;
    courseProgress.completedAt = new Date();

    await courseProgress.save();

    res.status(200).json({
      message: "Course marked as completed successfully",
      success: true,
      data: courseProgress,
    });
  } catch (error) {
    console.error("Error marking course as complete:", error);
    res.status(500).json({
      message: "Internal server error while marking course as complete",
    });
  }
};

// Reset course progress
export const resetCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    if (!userId || !courseId) {
      return res.status(400).json({
        message: "User ID and Course ID are required",
        success: false,
      });
    }

    const courseProgress = await CourseProgress.findOne({userId, courseId});

    if (!courseProgress) {
      return res.status(404).json({
        message: "Course progress not found",
        success: false,
      });
    }

    // Reset all lecture progress
    courseProgress.lectureProgress.forEach((progress) => {
      (progress.viewed = false),
        (progress.watchTime = 0),
        (progress.completed = false);
    });

    courseProgress.completed = false;
    courseProgress.completionPercentage = 0;
    courseProgress.completedAt = undefined;
    courseProgress.lastAccessedLecture = undefined;

    await courseProgress.save();

    res.status(200).json({
      message: "Course progress reset successfully",
      success: true,
      data: courseProgress,
    });
  } catch (error) {
    console.error("Error reseting course progress:", error);
    res.status(500).json({
      message: "Internal server error while reseting course progress",
      success: false,
    });
  }
};

// Delete course progress
export const deleteCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    if (!userId || !courseId) {
      return res.status(400).json({
        message: "User ID and Course ID are required",
        success: false,
      });
    }

    const courseProgress = await CourseProgress.findOneAndDelete({
      userId,
      courseId,
    });

    if (!courseProgress) {
      return res.status(404).json({
        message: "Course progress not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "course Progress deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting course progress:", error);
    res.status(500).json({
      message: "Internal server error while deleting course progress",
    });
  }
};

// Get course statistics for admin/instructor
export const getCourseStatistics = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required",
      });
    }

    const stats = await CourseProgress.aggregate([
      { $match: { courseId: mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: null,
          totalEnrolled: { $sum: 1 },
          totalCompleted: {
            $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] },
          },
          averageCompletion: { $avg: "$completionPercentage" },
        },
      },
    ]);

    const statistics =
      stats.length > 0
        ? stats[0]
        : {
            totalEnrolled: 0,
            totalCompleted: 0,
            averageCompletion: 0,
          };

    res.status(200).json({
      message: "Course statistics retrieved successfully",
      data: statistics,
    });
  } catch (error) {
    console.error("Error retrieving course statistics:", error);
    res.status(500).json({
      message: "Internal server error while retrieving course statistics",
    });
  }
};

// Bulk update lecture progress (for video player integration)
export const bulkUpdateLectureProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { lectureUpdates } = req.body; // Array of {lectureId, viewed, watchTime, completed}

    if (!userId || !courseId) {
      return res.status(400).json({
        message: "User ID, Course ID and lecture updates array are required",
      });
    }

    const courseProgress = await CourseProgress.findOne({ userId, courseId });

    if (!courseProgress) {
      return res.status(404).json({
        message: "Course progress not found",
        success: false,
      });
    }

    // Update multiple lectures
    lectureUpdates.forEach((update) => {
      const lectureProgressIndex = courseProgress.lectureProgress.findIndex(
        (progress) => progress.lectureId.toString() === update.lectureId
      );

      if (lectureProgressIndex !== -1) {
        if (update.viewed !== undefined) {
          courseProgress.lectureProgress[lectureProgressIndex].viewed =
            update.viewed;
        }
        if (update.watchTime !== undefined) {
          courseProgress.lectureProgress[lectureProgressIndex].watchTime =
            update.watchTime;
        }
        if (update.completed !== undefined) {
          courseProgress.lectureProgress[lectureProgressIndex].completed =
            update.completed;
        }
      }
    });

    // Recalculate completion percentage
    const totalLectures = courseProgress.lectureProgress.length;
    const completedLectures = courseProgress.lectureProgress.filter(
      (progress) => progress.completed
    ).length;

    courseProgress.completionPercentage =
      totalLectures > 0
        ? Math.round((completedLectures / totalLectures) * 100)
        : 0;

    // Check if course is completed
    if (
      courseProgress.completionPercentage === 100 &&
      !courseProgress.completed
    ) {
      courseProgress.completed = true;
      courseProgress.completedAt = new Date();
    }

    await courseProgress.save();

    res.status(200).json({
      message: "Lecture progress updated successfully",
      success: true,
      data: courseProgress,
    });
  } catch (error) {
    console.error("Error bulk updating lecture progress:", error);
    res.status(500).json({
      message: "Internal server error while bulk updating lecture progress",
      success: false,
    });
  }
};
