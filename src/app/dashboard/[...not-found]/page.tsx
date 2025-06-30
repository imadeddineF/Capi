"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "next-view-transitions";

// Shape components with animations
const Circle = ({
	className,
	delay = 0,
	size = 100,
}: {
	className?: string;
	delay?: number;
	size?: number;
}) => (
	<motion.div
		className={`rounded-full absolute ${className}`}
		style={{ width: size, height: size }}
		initial={{ opacity: 0, scale: 0 }}
		animate={{
			opacity: [0.7, 0.4, 0.7],
			scale: [1, 1.1, 1],
			rotate: [0, 180, 360],
		}}
		transition={{
			duration: 15,
			delay,
			repeat: Number.POSITIVE_INFINITY,
			ease: "easeInOut",
		}}
	/>
);

const Square = ({
	className,
	delay = 0,
	size = 80,
}: {
	className?: string;
	delay?: number;
	size?: number;
}) => (
	<motion.div
		className={`absolute ${className}`}
		style={{ width: size, height: size }}
		initial={{ opacity: 0, scale: 0 }}
		animate={{
			opacity: [0.6, 0.3, 0.6],
			scale: [1, 1.2, 1],
			rotate: [0, 90, 0],
		}}
		transition={{
			duration: 12,
			delay,
			repeat: Number.POSITIVE_INFINITY,
			ease: "easeInOut",
		}}
	/>
);

const Triangle = ({
	className,
	delay = 0,
	size = 80,
}: {
	className?: string;
	delay?: number;
	size?: number;
}) => (
	<motion.div
		className={`absolute ${className}`}
		style={{
			width: 0,
			height: 0,
			borderLeft: `${size / 2}px solid transparent`,
			borderRight: `${size / 2}px solid transparent`,
			borderBottom: `${size}px solid currentColor`,
		}}
		initial={{ opacity: 0, scale: 0 }}
		animate={{
			opacity: [0.5, 0.2, 0.5],
			scale: [1, 1.3, 1],
			rotate: [0, 120, 0],
		}}
		transition={{
			duration: 18,
			delay,
			repeat: Number.POSITIVE_INFINITY,
			ease: "easeInOut",
		}}
	/>
);

export default function NotFound() {
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	return (
		<div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
			{/* Background shapes */}
			<div className="absolute inset-0 -z-10">
				{/* Circles */}
				<Circle
					className="bg-primary/10 top-1/4 left-1/4 -translate-x-1/2"
					size={120}
				/>
				<Circle
					className="bg-accent/20 bottom-1/3 right-1/4"
					delay={2}
					size={150}
				/>
				<Circle
					className="bg-secondary/30 top-2/3 left-1/3"
					delay={4}
					size={90}
				/>

				{/* Squares */}
				<Square className="bg-muted/20 top-1/3 right-1/3 rotate-12" delay={1} />
				<Square
					className="bg-primary/15 bottom-1/4 left-1/5 rotate-45"
					delay={3}
					size={100}
				/>

				{/* Triangles */}
				<Triangle className="text-accent/10 top-1/2 right-1/5" delay={2} />
				<Triangle
					className="text-secondary/15 bottom-1/3 left-1/4 rotate-180"
					delay={5}
					size={120}
				/>
			</div>

			{/* Content */}
			<motion.div
				className="z-10 text-center px-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.5 }}
					className="mb-6 relative"
				>
					<div className="text-9xl font-bold opacity-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
						404
					</div>
					<motion.div
						className="text-8xl font-bold relative z-10"
						animate={{
							color: isDark
								? ["var(--primary)", "var(--accent)", "var(--primary)"]
								: [
										"var(--primary)",
										"var(--accent-foreground)",
										"var(--primary)",
								  ],
						}}
						transition={{
							duration: 8,
							repeat: Number.POSITIVE_INFINITY,
						}}
					>
						404
					</motion.div>
				</motion.div>

				<motion.h1
					className="text-3xl md:text-4xl font-bold mb-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.5 }}
				>
					Page Not Found
				</motion.h1>

				<motion.p
					className="text-muted-foreground mb-8 max-w-md mx-auto"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.7, duration: 0.5 }}
				>
					The page you are looking for does not exist or has been moved to
					another location.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.9, duration: 0.5 }}
				>
					<Button asChild size="lg" className="gap-2">
						<Link href="/dashboard">
							<Home className="w-4 h-4" />
							<span>Back to Home</span>
						</Link>
					</Button>
				</motion.div>
			</motion.div>
		</div>
	);
}
