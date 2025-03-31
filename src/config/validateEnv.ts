import Joi from "joi";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.dev" });
} else {
  dotenv.config();
}

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),

  PORT: Joi.number().default(3331),

  MONGO_DB_URL: Joi.string().uri().required().messages({
    "string.base": "MONGO_DB_URL must be a string",
    "string.uri": "MONGO_DB_URL must be a valid URI",
    "any.required": "MONGO_DB_URL is required",
  }),

  JWT_SECRET: Joi.string().min(32).required().messages({
    "string.base": "JWT_SECRET must be a string",
    "string.min": "JWT_SECRET must be at least 32 characters long",
    "any.required": "JWT_SECRET is required",
  }),

  FRONTEND_URL: Joi.string().uri().required().messages({
    "string.base": "FRONTEND_URL must be a string",
    "string.uri": "FRONTEND_URL must be a valid URI",
    "any.required": "FRONTEND_URL is required",
  }),

  SMTP_HOST: Joi.string().hostname().required().messages({
    "string.base": "SMTP_HOST must be a string",
    "string.hostname": "SMTP_HOST must be a valid hostname",
    "any.required": "SMTP_HOST is required",
  }),

  SMTP_PORT: Joi.number().min(1).max(65535).required().messages({
    "number.base": "SMTP_PORT must be a number",
    "number.min": "SMTP_PORT must be a valid port (1-65535)",
    "number.max": "SMTP_PORT must be a valid port (1-65535)",
    "any.required": "SMTP_PORT is required",
  }),

  SMTP_USERNAME: Joi.string().required().messages({
    "string.base": "SMTP_USERNAME must be a string",
    "any.required": "SMTP_USERNAME is required",
  }),

  SMTP_PASSWORD: Joi.string().required().messages({
    "string.base": "SMTP_PASSWORD must be a string",
    "any.required": "SMTP_PASSWORD is required",
  }),
}).unknown(true);

const { error, value: env } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(
    `⚠️  Invalid environment variables:\n${error.details
      .map((err) => err.message)
      .join("\n")}`
  );
}

export default env;
