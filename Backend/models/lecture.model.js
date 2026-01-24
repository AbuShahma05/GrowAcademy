import mongoose from "mongoose";

const lectureSchema = mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
    },
    publicId: {
      type: String,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      required: true,
    },
    isPreviewFree: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
