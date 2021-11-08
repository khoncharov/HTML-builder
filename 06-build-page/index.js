// Imports
const path = require("path");
const fsPrms = require("fs/promises");

// Const
const targetDir = "project-dist";
const assetsDir = "assets";
const srcStyles = "styles";
const srcComponents = "components";

const templateHTML = "template.html";
const targetHTML = "index.html";
const targetCSS = "style.css";

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

async function assembleProject() {
  try {
    // Прочтение и сохранение в переменной файла-шаблона
    const templateContent = await fsPrms.readFile(path.join(__dirname, templateHTML), {
      encoding: "utf-8",
    });
    // Нахождение всех имён тегов в файле шаблона
    const TAGre = /{{[a-z0-9-]+}}/gi;
    const arrTAG = templateContent.match(TAGre);

    // Замена шаблонных тегов содержимым файлов-компонентов
    let newContent = templateContent;
    for (let item of arrTAG) {
      const fileName = `${item.slice(2, -2)}.html`;
      const componentContent = await fsPrms.readFile(
        path.join(__dirname, srcComponents, fileName),
        {
          encoding: "utf-8",
        }
      );
      newContent = newContent.replace(item, componentContent);
    }
    // Запись изменённого шаблона в файл index.html в папке project-dist
    await fsPrms.mkdir(path.join(__dirname, targetDir), {
      recursive: true,
    });
    await fsPrms.writeFile(path.join(__dirname, targetDir, targetHTML), newContent);

    // Использовать скрипт написанный в задании 05-merge-styles для создания файла style.css
    await makeCSSBundle(__dirname, srcStyles, targetDir, targetCSS);

    // Использовать скрипт из задания 04-copy-directory для переноса папки assets в папку project-dist
    const assetsSrcPath = path.join(__dirname, assetsDir);
    const assetsDistPath = path.join(__dirname, targetDir, assetsDir);
    copyDirContent(assetsSrcPath, assetsDistPath);
  } catch (err) {
    console.error(err.message);
  }
}

assembleProject();
