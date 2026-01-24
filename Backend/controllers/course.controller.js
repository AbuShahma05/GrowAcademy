import mongoose from "mongoose";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import CoursePurchase from "../models/coursePurchase.model.js";
import CourseProgress from "../models/courseProgress.model.js";
import Lecture from "../models/lecture.model.js";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      subTitle,
      description,
      category,
      subCategory,
      courseLevel,
      language,
      previewVideo,
      coursePrice,
      originalPrice,
    } = req.body;

    // multer stores the uploaded file info in req.file
    const courseThumbnail = req.file ? req.file.filename : undefined;

    if (!courseThumbnail) {
      return res.status(400).json({
        message: "Course thumbnail is required",
        success: false,
      });
    }

    // Create new course
    const course = await Course.create({
      courseTitle,
      subTitle,
      description,
      category,
      subCategory,
      courseLevel,
      language,
      courseThumbnail,
      previewVideo,
      coursePrice,
      originalPrice,
      creator: req.user._id, // Assuming user is attached to req from auth middleware
    });

    res.status(201).json({
      message: "Course created successfully",
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("course not created", error);
    res.status(400).json({
      message: "Problem in course creation",
      success: false,
    });
  }
};

// Get all courses with filters
export const getAllCourses = async (req, res) => {
  try {
    const {
      category,
      courseLevel,
      language,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = { isPublished: true };

    if (category) filter.category = category;
    if (courseLevel) filter.courseLevel = courseLevel;
    if (language) filter.language = language;
    if (minPrice || maxPrice) {
      filter.coursePrice = {};
      if (minPrice) filter.coursePrice.$gte = Number(minPrice);
      if (maxPrice) filter.coursePrice.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { courseTitle: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // calculate pagination
    const skip = (page - 1) * limit;
    const sortObj = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    // Get courses with pagination
    const courses = await Course.find(filter)
      .populate("creator", "username email photoUrl")
      .populate("instructors", "username email photoUrl")
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalCourses: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Pagination error", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single course by id
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("creator", "username email photoUrl")
      .populate("instructors", "username email photoUrl")
      .populate({
        path: "lectures",
        select: "title description duration isPreview videoUrl",
      });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Course find error", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    // Check if the user is the creator or admin
    if (
      course.creator.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorised to update this course",
        success: false,
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Course updated successfully",
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Update course eror", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    // Check if user is the creator or admin
    if (
      course.creator.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorised to delete this course",
        success: false,
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Course deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Course not deletd", error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Toggle publish course
export const togglePublishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    // Check if the user is creator or admin
    if (
      course.creator.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorised to publish this course",
        success: false,
      });
    }

    course.isPublished = !course.isPublished;
    course.isDraft = !course.isPublished;

    if (course.isPublished && !course.publishedAt) {
      course.publishedAt = new Date();
    }

    await course.save();

    res.status(200).json({
      message: `Course ${
        course.isPublished ? "published" : "unpublished"
      } successfully`,
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("toggle publish error", error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Enroll in course
export const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user?._id || req.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({
        message: "Cannot enroll in unpublished course",
        success: false,
      });
    }

    // Check if already enrolled
    const alreadyEnrolled = course.enrolledStudents.some(
      (student) => student.studentId.toString() === userId.toString()
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        message: "Already enrolled in this course",
        success: false,
      });
    }

    // Add student to enrolled list
    course.enrolledStudents.push({
      studentId: userId,
      enrolledAt: new Date(),
      progress: 0,
    });

    course.totalEnrollments += 1;
    await course.save();

     try {
      // Get all lectures for this course
      const lectures = await Lecture.find({ courseId });

      // Create lecture progress array
      const lectureProgress = lectures.map((lecture) => ({
        lectureId: lecture._id,
        viewed: false,
        watchTime: 0,
        completed: false,
      }));

      // Create course progress
      const newProgress = new CourseProgress({
        userId,
        courseId,
        lectureProgress,
        completionPercentage: 0,
        completed: false,
      });

      await newProgress.save();
      console.log('Course progress initialized');
    } catch (progressError) {
      console.error("Progress initialization error:", progressError);
      // Don't fail enrollment if progress init fails
    }

    // Also update user's enrolledCourses
    await User.findByIdAndUpdate(userId, {
      $push: {
        enrolledCourses: {
          courseId: courseId,
          enrolledAt: new Date(),
          progress: 0
        }
      }
    });

    res.status(200).json({
      message: "Successfully enrolled in course",
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Enroll course error:", error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Get courses created by instructor
export const getCreatedCourse = async (req, res) => {
  try {
    const courses = await Course.find({ creator: req.user._id })
      .populate("lectures", "title duration")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Created course error", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  Update course progress
export const updateCourseProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    // Find the enrolled student
    const studentIndex = course.enrolledStudents.findIndex(
      (student) => student.studentId.toString() === req.user._id.toString()
    );

    if (studentIndex === -1) {
      return res.status(400).json({
        message: "Not enrolled in the course",
        success: false,
      });
    }

    // Update course
    course.enrolledStudents[studentIndex].progress = Math.max(
      course.enrolledStudents[studentIndex].progress,
      progress
    );

    await course.save();

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      data: {
        progress: course.enrolledStudents[studentIndex].progress,
      },
    });
  } catch (error) {
    console.error("course progress error", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get course statistics
export const getCourseStats = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    // Check if user is the creator or admin
    if (
      course.creator.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorised to view course statistics",
        success: false,
      });
    }

    const stats = {
      totalEnrollments: course.totalEnrollments,
      averageRating: course.averageRating,
      totalRatings: course.totalRatings,
      ratingDistribution: course.ratingDistribution,
      totalLectures: course.totalLectures,
      totalDuration: course.totalDuration,
      completionRate:
        course.enrolledStudents.length > 0
          ? (
              (course.enrolledStudents.filter((s) => s.progress === 100)
                .length /
                course.enrolledStudents.length) *
              100
            ).toFixed(2)
          : 0,
      averageProgress:
        course.enrolledStudents.length > 0
          ? (
              course.enrolledStudents.reduce((sum, s) => sum + s.progress, 0) /
              course.enrolledStudents.length
            ).toFixed(2)
          : 0,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Course statistics error", error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Get enrolled courses for a user
export const getEnrolledCourse = async (req, res) => {
  try {
    const userId = req.user?._id || req.id; // Get user ID from authenticated request

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    // Find courses where this user is enrolled
    const courses = await Course.find({
      "enrolledStudents.studentId": userId,
    })
      .populate("creator", "username email photoUrl")
      // .select("-enrolledStudents") // Don't send all enrolled students data
      .sort({ updatedAt: -1 });

    // Add user's specific progress to each course
    const coursesWithProgress = courses.map(course => {
      const courseObj = course.toObject();
      
      // Find this user's enrollment in the original course data
      const userEnrollment = course.enrolledStudents?.find(
        s => s.studentId.toString() === userId.toString()
      );

      return {
        ...courseObj,
        userProgress: userEnrollment?.progress || 0,
        enrolledAt: userEnrollment?.enrolledAt || null
      };
    });

    res.status(200).json({
      success: true,
      data: coursesWithProgress,
    });
  } catch (error) {
    console.error("Enrolled course error", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};