import winston from "winston";
import chalk from "chalk";

const colorizeLevel = (level: string) => {
  switch (level) {
    case "info":
      return chalk.green(level.toUpperCase());
    case "warn":
      return chalk.yellow(level.toUpperCase());
    case "error":
      return chalk.red(level.toUpperCase());
    case "debug":
      return chalk.blue(level.toUpperCase());
    default:
      return level.toUpperCase();
  }
};

const levelEmojis: Record<string, string> = {
  info: "🟢",
  warn: "🟡",
  error: "🔴",
  debug: "🔵",
};

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      const emoji = levelEmojis[level] || "🔵";
      const coloredLevel = colorizeLevel(level);
      return stack
        ? `[${timestamp}] ${emoji} ${coloredLevel}: ${message}\nStack Trace: ${stack}`
        : `[${timestamp}] ${emoji} ${coloredLevel}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/app.log",
      format: winston.format.combine(winston.format.uncolorize()),
    }),
  ],
});

export { logger };
