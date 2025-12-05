import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/hero-images/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "hero_" + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage });

export default upload;
