const fs = require("fs");
const path = require("path");

const targetFolder = "secret-folder";

fs.readdir(
  path.join(__dirname, targetFolder),
  { withFileTypes: true },
  readFolderContent
);

function getFileName(fileObj, fileExt) {
  if (fileExt === ".") {
    return fileObj.name.slice(0, -1);
  } else if (fileExt === "") {
    return fileObj.name;
  } else {
    return fileObj.name.split(`${fileExt}`)[0];
  }
}

function readFolderContent(err, data) {
  if (err) {
    console.log(err.message);
  }
  const fileArr = data.filter((item) => item.isFile());
  fileArr.forEach((file) => {
    const ext = path.extname(file.name);
    const fileName = getFileName(file, ext);
    fs.stat(path.join(__dirname, targetFolder, file.name), (err, stats) => {
      if (err) {
        console.log(err.message);
      }
      const fileSize = (stats.size / 1024).toFixed(3);
      console.log(`${fileName} - ${ext.slice(1)} - ${fileSize}kB`);
    });
  });
}
