const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = {
  singleFile: (fieldName) => upload.single(fieldName),

  multipleFiles: (fieldName, maxCount) => upload.array(fieldName, maxCount),

  fields: (fieldsArray) => upload.fields(fieldsArray),
};
