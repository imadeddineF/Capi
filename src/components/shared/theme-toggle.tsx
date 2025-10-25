"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<button className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent">
				<span className="sr-only">Toggle theme</span>
			</button>
		);
	}

	const isDark = theme === "dark";

	return (
		<button
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			aria-label="Toggle theme"
		>
			<motion.div
				initial={false}
				animate={{
					scale: isDark ? 0 : 1,
					opacity: isDark ? 0 : 1,
					rotate: isDark ? 90 : 0,
				}}
				transition={{
					duration: 0.2,
					ease: "easeInOut",
				}}
				className="absolute"
			>
				<Sun className="h-4 w-4" />
			</motion.div>
			<motion.div
				initial={false}
				animate={{
					scale: isDark ? 1 : 0,
					opacity: isDark ? 1 : 0,
					rotate: isDark ? 0 : -90,
				}}
				transition={{
					duration: 0.2,
					ease: "easeInOut",
				}}
				className="absolute"
			>
				<Moon className="h-4 w-4" />
			</motion.div>
		</button>
	);
}
