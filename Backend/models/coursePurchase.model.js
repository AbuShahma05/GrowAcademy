import mongoose from "mongoose";

const coursePurchaseSchema = mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["FREE", "PAID"],
      default: "FREE",
    },
    paymentId: {
      type: String,
      default: null,
    },
    progress: {
    type: Number,
    default: 0,
  },
  },
  { timestamps: true }
);

const coursePurchase = mongoose.model("CoursePurchase", coursePurchaseSchema);

export default coursePurchase;
