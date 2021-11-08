// Imports
const path = require("path");
const fsPrms = require("fs/promises");

async function makeCSSBundle(rootFolder, srcFolder, targetFolder, bundleName) {
  const distBundle = path.resolve(rootFolder, targetFolder, bundleName);
  // Delete old file
  try {
    await fsPrms.unlink(distBundle);
  } catch {}

  try {
    // Read src folder content
    const files = await fsPrms.readdir(path.join(rootFolder, srcFolder), {
      withFileTypes: true,
    });
    // Read css files
    let bundleContent = "";
    for (const item of files) {
      if (item.isFile() && path.extname(item.name) === ".css") {
        const stylePath = path.join(rootFolder, srcFolder, item.name);
        bundleContent += await fsPrms.readFile(stylePath, { encoding: "utf-8" });
        bundleContent += "\n\n";
      }
    }
    // Write bundle
    await fsPrms.writeFile(
      path.join(rootFolder, targetFolder, bundleName),
      bundleContent
    );
  } catch (err) {
    console.error(err.message);
  }
}

module.exports.makeCSSBundle = makeCSSBundle;
