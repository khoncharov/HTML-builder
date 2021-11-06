const fs = require("fs");
const path = require("path");
const process = require("process");
const readline = require("readline");

const fileName = "text.txt";
// fs.unlink(path.join(__dirname, fileName), () => {});

const writeStream = fs.createWriteStream(path.join(__dirname, fileName));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const inputHandler = (line) => {
  if (line === "exit") {
    rl.emit("close");
  } else {
    writeStream.write(`${line}\n`);
  }
};

rl.question("Enter your text: (ctrl+c or 'exit' for termination)\n", inputHandler);

rl.on("line", inputHandler);

rl.on("close", () => {
  console.log("<--- process terminated");
  process.exit();
});
