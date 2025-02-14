const multer = require("multer");
const fs = require("fs");
const path = require("path");



const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "uploads/"); // Ensure this folder exists
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
module.exports = upload;
