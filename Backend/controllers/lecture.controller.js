import Lecture from "../models/lecture.model.js";
import Course from "../models/course.model.js";
import {
  uploadVideoToCloudinary,
  deleteMediaFromCloudinary,
} from "../utils/cloudinary.js";

// Create a new lecture
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle, courseId, duration, order, isPreviewFree } = req.body;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        success: false,
        message: "LectureTitle and courseId are required",
        body: req.body,
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const existingLecture = await Lecture.findOne({
      course: courseId,
      order,
    });

    if (existingLecture) {
      return res.status(409).json({
        success: false,
        message: "Lecture with this order already exists",
      });
    }

    let cloudResponse = null;
    if (req.file) {
      cloudResponse = await uploadVideoToCloudinary(req.file.path);
    }

    const lecture = await Lecture.create({
      lectureTitle,
      videoUrl: cloudResponse ? cloudResponse.secure_url : "",
      publicId: cloudResponse ? cloudResponse.public_id : "",
      courseId,
      duration: Number(duration || 0),
      order: Number(order),
      isPreviewFree: Boolean(isPreviewFree),
    });

    course.lectures.push(lecture._id);
    course.totalLectures += 1;
    course.totalDuration += Number(duration || 0);
    await course.save();

    return res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      data: lecture,
    });
  } catch (error) {
    console.error("Error creating lecture:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save lecture",
    });
  }
};

// Get all lectures
export const getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find()
      .populate("courseId", "title description")
      .sort({ courseId: 1, order: 1 });

    return res.status(200).json({
      message: "Lectures fetched successfully",
      success: true,
      data: lectures,
    });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    return res.status(500).json({
      message: "Internal server error while fetching lectures",
      success: false,
    });
  }
};

// Get lecture by ID
export const getLectureById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Lecture ID is required",
        success: false,
      });
    }

    const lecture = await Lecture.findById(id).populate(
      "courseId",
      "title description"
    );

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Lecture fetched successfully",
      success: true,
      data: lecture,
    });
  } catch (error) {
    console.error("Error fetching lecture by ID:", error);
    return res.status(500).json({
      message: "Internal server error while fetching lecture",
      success: false,
    });
  }
};

// Get lectures by course ID
export const getLecturesByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required",
        success: false,
      });
    }

    // Check if course exists
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    let lectures;

    // STUDENT LOGIC
    if (req.user.role === "Student") {
      const isEnrolled = await Course.exists({
        _id: courseId,
        "enrolledStudents.studentId": req.user._id,
      });

      if (!isEnrolled) {
        //  Not enrolled → preview lectures only
        lectures = await Lecture.find({
          courseId,
          isPreviewFree: true,
        })
          .select("lectureTitle duration order isPreviewFree videoUrl")
          .sort({ order: 1 });
      } else {
        // Enrolled → full access
        lectures = await Lecture.find({ courseId })
          .select("lectureTitle duration order isPreviewFree videoUrl")
          .sort({ order: 1 });
      }
    } else {
      // TEACHER / ADMIN
      lectures = await Lecture.find({ courseId })
        .select("lectureTitle duration order isPreviewFree videoUrl")
        .sort({ order: 1 });
    }

    // SEND RESPONSE
    return res.status(200).json({
      success: true,
      message: "Course lectures fetched successfully",
      data: lectures,
    });
  } catch (error) {
    console.error("Error fetching course lectures:", error);
    return res.status(500).json({
      message: "Internal server error while fetching course lectures",
      success: false,
    });
  }
};

// Get free preview lectures by course ID
export const getPreviewLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required",
        success: false,
      });
    }

    const freePreviewLectures = await Lecture.find({
      courseId,
      isPreviewFree: true,
    }).sort({ order: 1 });

    return res.status(200).json({
      message: "Free preview lectures fetched successFully",
      success: true,
      data: freePreviewLectures,
    });
  } catch (error) {
    console.error("Error fetching free preview lectures:", error);
    return res.status(500).json({
      message: "Internal server error while fetching free preview lectures",
      success: false,
    });
  }
};

// Update lecture
export const updateLectures = async (req, res) => {
  try {
    const { id } = req.params;
    const { lectureTitle, videoUrl, publicId, duration, order, isPreviewFree } =
      req.body;

    if (!id) {
      return res.status(400).json({
        message: "Lecture ID is required",
        success: false,
      });
    }

    const lecture = await Lecture.findById(id);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
        success: false,
      });
    }

    if (req.file) {
      // delete old video if exists
      if (lecture.publicId) {
        await deleteMediaFromCloudinary(lecture.publicId);
      }
      const cloudResponse = await uploadVideoToCloudinary(req.file.path);
      lecture.videoUrl = cloudResponse.secure_url;
      lecture.publicId = cloudResponse.public_id;
    }

    // If order is being updated, check for conflicts
    if (order && order !== lecture.order) {
      const existingLecture = await Lecture.findOne({
        courseId: lecture.courseId,
        order,
        _id: { $ne: id },
      });

      if (existingLecture) {
        return res.status(409).json({
          message: "Lecture with this order already exists for the course",
          success: false,
        });
      }
    }

    // Update fields
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoUrl !== undefined) lecture.videoUrl = videoUrl;
    if (publicId !== undefined) lecture.publicId = publicId;
    if (duration !== undefined) lecture.duration = duration;
    if (order !== undefined) lecture.order = order;
    if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

    const updatedLecture = await lecture.save();

    return res.status(200).json({
      message: "Lecture updated successfully",
      success: true,
      data: updatedLecture,
    });
  } catch (error) {
    console.error("Error updating lectures:", error);
    return res.status(500).json({
      message: "Internal server error while updating lecture",
      success: false,
    });
  }
};

// Delete lecture
export const deleteLectures = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Lecture ID is required",
        success: false,
      });
    }

    const lecture = await Lecture.findById(id);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
        success: false,
      });
    }

    await Lecture.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Lecture deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    return res.status(500).json({
      message: "Internal server error while deleting lecture",
      success: false,
    });
  }
};

// Reorder lectures within a course
export const reorderLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lectureOrders } = req.body;

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required",
        success: false,
      });
    }

    if (!lectureOrders || !Array.isArray(lectureOrders)) {
      return res.status(400).json({
        message: "Lecture orders array is required",
        success: false,
      });
    }

    // Check if course exists
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    // Update each lecture's order
    const updatePromises = lectureOrders.map(
      async ({ lectureId, newOrder }) => {
        return await Lecture.findByIdAndUpdate(
          lectureId,
          { order: newOrder },
          { new: true }
        );
      }
    );

    const updatedLectures = await Promise.all(updatePromises);

    return res.status(200).json({
      message: "Lectures reordered successfully",
      success: true,
      data: updatedLectures,
    });
  } catch (error) {
    console.error("Error reordering lectures:", error);
    return res.status(500).json({
      message: "Internal server error while reordering lectures",
      success: false,
    });
  }
};

// Get lecture statistics
export const getLectureStats = async (req, res) => {
  try {
    const totalLectures = await Lecture.countDocuments();
    const totalFreePreviewLectures = await Lecture.countDocuments({
      isPreviewFree: true,
    });
    const lectureWithVideo = await Lecture.countDocuments({
      videoUrl: {
        $exists: true,
        $ne: "",
      },
    });

    // Calculate total duration
    const durationData = await Lecture.aggregate([
      { $group: { _id: null, totalDuration: { $sum: "$duration" } } },
    ]);

    const totalDuration =
      durationData.length > 0 ? durationData[0].totalDuration : 0;

    // Get lectures per course
    const lecturesPerCourse = await Lecture.aggregate([
      {
        $group: {
          _id: "$courseId",
          lectureCount: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $project: {
          courseId: "$_id",
          courseName: { $arrayElement: ["$course.title", 0] },
          lectureCount: 1,
          totalDuration: 1,
        },
      },
    ]);

    const stats = {
      totalLectures,
      totalFreePreviewLectures,
      lectureWithVideo,
      totalDuration,
      lecturesPerCourse,
    };

    return res.status(200).json({
      message: "Lecture statistics fetched successfully",
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching lecture statistics:", error);
    return res.status(500).json({
      message: "Internal server error while fetching lecture statistics",
      success: false,
    });
  }
};

// Toggle preview free status
export const togglePreviewStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Lecture ID is required",
        success: false,
      });
    }

    const lecture = await Lecture.findById(id);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
        success: false,
      });
    }

    lecture.isPreviewFree = !lecture.isPreviewFree;
    const updatedLecture = await lecture.save();

    return res.status(200).json({
      message: `Lecture preview status ${
        lecture.isPreviewFree ? "enabled" : "disabled"
      } successfully`,
      success: true,
      data: updatedLecture,
    });
  } catch (error) {
    console.error("Error toggling preview status:", error);
    return res.status(500).json({
      message: "Internal server error while toggling preview status",
    });
  }
};
