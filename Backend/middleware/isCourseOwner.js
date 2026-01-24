import Course from "../models/course.model.js";

const isCourseOwner = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Compare creator ID with user._id
    if (course.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Error checking course ownership",
      });
    }

    next();
  } catch (error) {
    console.error("Ownership error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking course ownership",
    });
  }
};

export default isCourseOwner;
