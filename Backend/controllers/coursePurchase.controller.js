import CoursePurchase from "../models/coursePurchase.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

// Create a new course purchase
export const createCoursePurchase = async (req, res) => {
  try {
    const { courseId, userId, amount, paymentId } = req.body;

    // Validate required fields
    if (!courseId || !userId || !amount || !paymentId) {
      return res.status(400).json({
        message: "All fields are required",
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

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if user already purchased this course
    const existingPurchase = await CoursePurchase.findOne({
      courseId,
      userId,
      status: "completed",
    });

    if (existingPurchase) {
      return res.status(409).json({
        message: "Course already purchased by this user",
        success: false,
      });
    }

    // Create new course purchase
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount,
      paymentId,
      status: "pending",
    });

    const savedPurchase = await newPurchase.save();

    return res.status(201).json({
      message: "Course purchase created successfully",
      success: true,
      data: savedPurchase,
    });
  } catch (error) {
    console.error("Error creating course purchase:", error);
    return res.status(500).json({
      message: "Internal server error while creating course purchase",
      success: false,
    });
  }
};

// Get all course purchases
export const getAllCoursePurchases = async (req, res) => {
  try {
    const purchases = await CoursePurchase
      .find()
      .populate("courseId", "title price")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Course purchases fetched successfully",
      success: true,
      data: purchases,
    });
  } catch (error) {
    console.error("Error fetching course purchases:", error);
    return res.status(500).json({
      message: "Internal server error while fetching course purchases",
      success: false,
    });
  }
};

// Get course purchase by ID
export const getCoursePurchasedById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Purchase ID is required",
        success: false,
      });
    }

    const purchase = await CoursePurchase
      .findById(id)
      .populate("courseId", "title price")
      .populate("userId", "name email");

    if (!purchase) {
      return res.status(404).json({
        message: "Course purchase not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Course purchase fetched successfully",
      success: true,
      data: purchase,
    });
  } catch (error) {
    console.error("Error fetching course purchase by ID:", error);
    return res.status(500).json({
      message: "Internal server error while fetching course purchase",
      success: false,
    });
  }
};

// Get course purchases by user ID
export const getCoursePurchaseByUserId = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
      });
    }

    const purchases = await CoursePurchase
      .find({ userId, status: "completed" })
      .populate("courseId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "User course purchases fetched successfully",
      success: true,
      data: purchases,
    });
  } catch (error) {
    console.error("Error fetching user course purchases:", error);
    return res.status(500).json({
      message: "Internal server error while fetching user course purchases",
      success: false,
    });
  }
};

// Update course purchase status
export const updateCoursePurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Purchase ID is required",
        success: false,
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    // Validate status
    const validateStatuses = ["pending", "completed", "failed"];
    if (!validateStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be pending, completed, or failed",
        success: false,
      });
    }

    const purchase = await CoursePurchase.findById(id);
    if (!purchase) {
      return res.status(404).json({
        message: "Course purchase not found",
        success: false,
      });
    }

    purchase.status = status;
    const updatedPurchase = await purchase.save();

    return res.status(200).json({
      message: "Course purchase status updated successfully",
      success: true,
      data: updatedPurchase,
    });
  } catch (error) {
    console.error("Error updating course purchase status:", error);
    return res.status(500).json({
      message: "Internal server error while updating course purchase status",
      success: false,
    });
  }
};

// Delete course purchase
export const deleteCoursePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Purchase ID is required",
        success: false,
      });
    }

    const purchase = await CoursePurchase.findById(id);
    if (!purchase) {
      return res.status(404).json({
        message: "Course purchase not found",
        success: false,
      });
    }

    await CoursePurchase.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Course purchase deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting course purchase:", error);
    return res.status(500).json({
      message: "Internal server error while deleting course purchase",
      success: false,
    });
  }
};

// Get course purchase statistics
export const getCoursePurchaseStats = async (req, res) => {
  try {
    const totalPurchases = await CoursePurchase.countDocuments();
    const completedPurchases = await CoursePurchase.countDocuments({
      status: "completed",
    });
    const pendingPurchases = await CoursePurchase.countDocuments({
      status: "pending",
    });
    const failedPurchase = await CoursePurchase.countDocuments({
      status: "failed",
    });

    // Calculate total revenue from completed purchases
    const revenueData = await CoursePurchase.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const stats = {
      totalPurchases,
      completedPurchases,
      pendingPurchases,
      failedPurchase,
      totalRevenue,
    };

    console.log("Course purchase statistics fetched successfully");
    return res.status(200).json({
      message: "Course purchase statistics fetched successfully",
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching course purchase statistics", error);
    return res.status(500).json({
      message:
        "Internal server error while fetching course purchase statistics",
      success: false,
    });
  }
};

// Verify course access (check if user has completed purchase)
export const verifyCourseAccess = async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    if (!courseId || !userId) {
      return res.status(400).json({
        message: "Course ID and user ID are required",
        success: false,
      });
    }

    const purchase = await CoursePurchase.findOne({
      courseId,
      userId,
      status: "completed",
    });

    if (!purchase) {
      return res.status(403).json({
        message: "Course access denied. Purchase not found or not completed",
        success: false,
        hasAccess: false,
      });
    }

    return res.status(200).json({
      message: "Course access verified successfully",
      success: true,
      hasAccess: true,
      data: purchase,
    });
  } catch (error) {
    console.error("Error verifying course access:", error);
    return res.status(500).json({
      message: "Internal server error while verifying course access",
      success: false,
    });
  }
};

// Get enrolled courses for logged-in student
export const getMyEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const purchases = await CoursePurchase.find({ userId })
      .populate({
        path: "courseId",
        populate: { path: "creator", select: "username" },
      })
      .sort({ createdAt: -1 });

    const courses = purchases.map(p => {
      const course = p.courseId.toObject();
      course.enrolledStudents = [{ studentId: userId, progress: p.progress }];
      return course;
    });

    return res.status(200).json({ success: true, data: courses });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
