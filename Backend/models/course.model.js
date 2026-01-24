import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [100, "Course title cannot exceed 100 characters"],
    },
    subTitle: {
      type: String,
      trim: true,
      maxlength: [120, "Subtitle cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    // Course Classification
    category: {
      type: String,
      required: [true, "Course category is required"],
      enum: [
        "Development",
        "DSA",
        "Machine Learning",
        "Business",
        "IT & Software",
        "Personal Development",
        "Photography",
        "Music",
        "Health & Fitness",
        "Teaching & Academics",
      ],
    },
    subCategory: {
      type: String,
    },
    courseLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: [true, "Course level is required"],
    },
    language: {
      type: String,
      required: [true, "Course language is required"],
      default: "Hinglish",
    },

    // Course Content
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    totalDuration: {
      type: Number, // in minutes
      default: 0,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },

    // Media
    courseThumbnail: {
      type: String,
      required: [true, "Course thumbnail is required"],
    },
    previewVideo: {
      type: String, // URL to preview video
    },

    // Pricing
    coursePrice: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Course price cannot be negative"],
    },
    originalPrice: {
      type: Number, // For showing discounts
    },

    // Enrollment & Performance
    enrolledStudents: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
          index: true,
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
      },
    ],
    totalEnrollments: {
      type: Number,
      default: 0,
    },

    // Ratings & Reviews
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    ratingDistribution: {
      five: { type: Number, default: 0 },
      four: { type: Number, default: 0 },
      three: { type: Number, default: 0 },
      two: { type: Number, default: 0 },
      one: { type: Number, default: 0 },
    },

    // Course Management
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Course creator is required"],
    },
    instructors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // For co-instructors
      },
    ],

    // Publishing & Status
    isPublished: {
      type: Boolean,
      default: false,
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
