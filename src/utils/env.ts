import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

interface EnvConfig {
	NEXT_PUBLIC_LOCAL_API_URL: string;
	NEXT_PUBLIC_HOSTED_API_URL: string;
	PORT: number;
	ENV: "development" | "production" | "test";
}

const getEnv: EnvConfig = {
	NEXT_PUBLIC_LOCAL_API_URL: process.env.NEXT_PUBLIC_LOCAL_API_URL ?? "",
	NEXT_PUBLIC_HOSTED_API_URL: process.env.NEXT_PUBLIC_HOSTED_API_URL ?? "",
	PORT: parseInt(process.env.PORT ?? "3000", 10),
	ENV:
		(process.env.ENV as "development" | "production" | "test") ?? "development",
};

const requiredVars: (keyof EnvConfig)[] = [
	"NEXT_PUBLIC_LOCAL_API_URL",
	"NEXT_PUBLIC_HOSTED_API_URL",
	"PORT",
	"ENV",
];

for (const varName of requiredVars) {
	if (!getEnv[varName]) {
		throw new Error(`⛔ Missing required environment variable: ${varName}`);
	}
}

export default getEnv;
