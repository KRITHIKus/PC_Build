import dotenv from "dotenv";

dotenv.config();

const _required = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

const _optional = (key, fallback) => process.env[key] ?? fallback;

export const env = {
  NODE_ENV: _optional("NODE_ENV", "development"),
  PORT: parseInt(_optional("PORT", "5000"), 10),

  MONGO_URI: 'mongodb+srv://krithik_us:tncehs@mern-blog.zsync.mongodb.net/PC_Build?retryWrites=true&w=majority&appName=mern-blog',

  JWT_SECRET:"PC_BUILD",
  JWT_EXPIRES_IN: _optional("JWT_EXPIRES_IN", "7d"),
  JWT_COOKIE_EXPIRES_IN: parseInt(_optional("JWT_COOKIE_EXPIRES_IN", "7"), 10),

  CLIENT_URL: _optional("CLIENT_URL", "http://localhost:3000"),


   CLOUDINARY_CLOUD_NAME: "dpo6xxow5",
  CLOUDINARY_API_KEY:"853931258273262",
  CLOUDINARY_API_SECRET: "Qgrpzy2aLPRMmd0JiNDk2uw2--8",
  
  get isDev() {
    return this.NODE_ENV === "development";
  },
  get isProd() {
    return this.NODE_ENV === "production";
  },
};