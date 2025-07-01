interface EnvConfig {
  NEXT_PUBLIC_LOCAL_API_URL: string;
  NEXT_PUBLIC_HOSTED_API_URL: string;
  PORT: number;
  ENV: "development" | "production" | "test";
}

// Only use process.env.* directly, no Node.js code!
const getEnv: EnvConfig = {
  NEXT_PUBLIC_LOCAL_API_URL:
    process.env.NEXT_PUBLIC_LOCAL_API_URL ||
    "https://c41d-129-45-22-206.ngrok-free.app",
  NEXT_PUBLIC_HOSTED_API_URL:
    process.env.NEXT_PUBLIC_HOSTED_API_URL ||
    "https://c41d-129-45-22-206.ngrok-free.app",
  PORT: parseInt(process.env.PORT || "3000", 10),
  ENV:
    (process.env.ENV as "development" | "production" | "test") || "development",
};

export default getEnv;
