// Imports
const path = require("path");
const fsPrms = require("fs/promises");

async function copyDirContent(srcDir, distDir) {
  const items = await fsPrms.readdir(srcDir, { withFileTypes: true });
  for (const item of items) {
    // Copy files
    if (item.isFile()) {
      const srcFile = path.join(srcDir, item.name);
      const distFile = path.join(distDir, item.name);
      await fsPrms.copyFile(srcFile, distFile);
    } else if (item.isDirectory()) {
      // Create folder
      await fsPrms.mkdir(path.join(distDir, item.name), { recursive: true });
      await copyDirContent(path.join(srcDir, item.name), path.join(distDir, item.name));
    }
  }
}

module.exports.copyDirContent = copyDirContent;
