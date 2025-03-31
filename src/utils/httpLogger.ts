import morgan from "morgan";
import fs from "fs";
import path from "path";
import chalk from "chalk";

const logFilePath = path.join(process.cwd(), "/logs/http.log");
const accessLogStream = fs.createWriteStream(logFilePath, { flags: "a" });

morgan.token("custom-date", () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
});

const format =
  ":custom-date [:method] [:url] [:status] [:response-time ms] - [:res[content-length]]";

export const httpLogger = morgan(format, {
  stream: {
    write: (message) => {
      console.log(chalk.green(message.trim()));
      accessLogStream.write(message);
    },
  },
});
