import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [25, "Username cannot exceed 25 characters"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [128, "Password cannot exceed 128 characters"],
      select: false, // never return password in queries by default
    },

    // Role Management
    role: {
      type: String,
      enum: ["Student", "Teacher", "Admin"],
      required: true,
      default: "Student",
    },

    // Profile Info
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    photoUrl: {
      type: String,
      default: "",
    },

    // Course Related
    enrolledCourses: {
      type: [
        {
          courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
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
      default: [],
    },

    // For Teachers
    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    // Account Status
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Social Links (optional)
    socialLinks: {
      website: String,
      linkedin: String,
      twitter: String,
      youtube: String,
    },
    emailVerificationToken: {
      type: String,
      default: undefined,
    },
    passwordresetToken: {
      type: String,
      default: undefined,
    },

    passwordResetExpires: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
    // indexes for better performance
    indexes: [{ email: 1 }, { username: 1 }, { role: 1 }],
  },
);

const User = mongoose.model("User", userSchema);

export default User;
