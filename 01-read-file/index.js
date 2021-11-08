const fs = require("fs");
const path = require("path");

const fileToRead = "text.txt";

const rs = fs.createReadStream(`${path.join(__dirname, fileToRead)}`, "utf-8");

rs.on("data", (chunk) => {
  console.log(chunk);
});

rs.on("error", (err) => {
  console.error(err.message);
});
