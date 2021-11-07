// Imports
const path = require("path");
const fsPromises = require("fs/promises");

// Const
const srcDir = "files";
const targetDir = "files-copy";

// Functions
async function copyDir() {
  try {
    // Create dir
    await fsPromises.mkdir(path.join(__dirname, targetDir), {
      recursive: true,
    });
    // Create oldFilenames array
    const oldFiles = await fsPromises.readdir(path.join(__dirname, targetDir), {
      withFileTypes: true,
    });
    // Delete old files
    for (const item of oldFiles) {
      if (item.isFile()) {
        await fsPromises.unlink(path.join(__dirname, targetDir, item.name));
      }
    }
    // Create filenames array
    const files = await fsPromises.readdir(path.join(__dirname, srcDir), {
      withFileTypes: true,
    });
    // Copy files
    for (const item of files) {
      if (item.isFile()) {
        const srcFile = path.join(__dirname, srcDir, item.name);
        const distFile = path.join(__dirname, targetDir, item.name);
        await fsPromises.copyFile(srcFile, distFile);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

copyDir();
