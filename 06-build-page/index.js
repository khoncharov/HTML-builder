// Imports
const path = require("path");
const fsPrms = require("fs/promises");
const { makeCSSBundle } = require("./merge-slyles.js");
const { copyDirContent } = require("./copy-dir.js");

// Const
const targetDir = "project-dist";
const assetsDir = "assets";
const srcStyles = "styles";
const srcComponents = "components";

const targetHTML = "index.html";
const templateHTML = "template.html";
const targetCSS = "style.css";

async function assambleHTML() {
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
assambleHTML();
