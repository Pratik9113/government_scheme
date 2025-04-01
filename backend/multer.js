import multer from "multer";
import fs from "fs";
import path from "path";

// Define storage settings
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "uploads/"); // Ensure this folder exists
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

// Create upload instance
const upload = multer({ storage });

export default upload;
