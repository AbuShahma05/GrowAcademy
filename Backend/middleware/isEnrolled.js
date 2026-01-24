import User from "../models/user.model.js";

const isEnrolled = async (req, res, next) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required",
        success: false,
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isEnrolled = Array.isArray(user.enrolledCourses)
      ? user.enrolledCourses.some(
          (course) => course.courseId?.toString() === courseId
        )
      : false;

    if (!isEnrolled) {
      return res.status(403).json({
        message: "You must be enrolled in this course to access this content",
        success: false,
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error checking enrollment",
      success: false,
    });
  }
};

export default isEnrolled;
