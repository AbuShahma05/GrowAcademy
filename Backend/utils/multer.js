import multer from "multer";
import path from "path";
import fs from 'fs'

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Image filter
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

// Video filter
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mkv|webm|avi|mov/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = file.mimetype.startsWith("video/");

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"));
  }
};

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB (thumbnails)
  fileFilter: imageFilter,
});

export const uploadVideo = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB (videos)
  fileFilter: videoFilter,
});

