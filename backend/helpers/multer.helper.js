const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    cb(null, uploadPath);
  },

  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadFile = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const fileTypes = /xlsx|xls/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extName) {
      cb(null, true);
    } else {
      cb("Only Excel files are allowed!");
    }
  },
});

module.exports = uploadFile;
