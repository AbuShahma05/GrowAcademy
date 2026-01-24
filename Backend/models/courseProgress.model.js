import mongoose from "mongoose";

const lectureProgressSchema = mongoose.Schema({
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: true,
  },
  viewed: {
    type: Boolean,
    default: false,
  },
  watchTime: {
    type: Number, // in seconds
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const courseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lectureProgress: [lectureProgressSchema], // Array of lecture progress
    lastAccessedLecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

export default CourseProgress;
