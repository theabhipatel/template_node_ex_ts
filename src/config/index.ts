import env from "./validateEnv";

export const PORT = env.PORT || 3331;
export const MONGO_DB_URL = env.MONGO_DB_URL!;
export const JWT_SECRET = env.JWT_SECRET!;

export const FRONTEND_URL = env.FRONTEND_URL!;

/** ---> SMTP credentials. */
export const SMTP_HOST = env.SMTP_HOST!;
export const SMTP_PASSWORD = env.SMTP_PASSWORD!;
export const SMTP_PORT = env.SMTP_PORT!;
export const SMTP_USERNAME = env.SMTP_USERNAME!;
