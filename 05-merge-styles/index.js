// Imports
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

// Const
const srcFolder = "styles";
const targetFolder = "project-dist";
const bundleName = "bundle.css";

async function makeBundle() {
  const distBundle = path.join(__dirname, targetFolder, bundleName);
  // Delete old file
  try {
    await fsPromises.unlink(distBundle);
  } catch {}

  try {
    // Read src folder content
    const files = await fsPromises.readdir(path.join(__dirname, srcFolder), {
      withFileTypes: true,
    });
    // Dist file
    const ws = fs.createWriteStream(distBundle, { flags: "a" });
    ws.on("error", (err) => {
      console.log(err.message);
    });
    // Sort css files
    for (const item of files) {
      if (item.isFile() && path.extname(item.name) === ".css") {
        const rs = fs.createReadStream(path.join(__dirname, srcFolder, item.name));
        rs.on("open", () => {
          // Add styles to bundle
          rs.pipe(ws);
        });
        rs.on("error", (err) => {
          console.log(err.message);
        });
      }
    }
  } catch (err) {
    console.error(">", err.message);
  }
}

makeBundle();
