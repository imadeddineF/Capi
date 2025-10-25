"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import logoIcon from "../../../public/logo-icon.svg";
import logoText from "../../../public/logo-text.svg";
import logoTextDark from "../../../public/logo-text-dark.svg";
import { useTheme } from "next-themes";

interface AuthLayoutProps {
	children: React.ReactNode;
	title: string;
	subtitle: string;
	showFooter?: boolean;
}

export function AuthLayout({
	children,
	title,
	subtitle,
	showFooter = true,
}: AuthLayoutProps) {
	const { theme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="min-h-screen bg-background flex flex-col relative ">
			{/* Header */}

			<Link
				href="/"
				className="absolute top-4 left-4 flex items-center gap-1 group"
			>
				<Image src={logoIcon} alt="Logo" className="h-7 w-7" />
				{mounted && (
					<Image
						src={theme === "dark" ? logoTextDark : logoText}
						alt="Capi"
						className="h-6 transition-opacity duration-200"
					/>
				)}
			</Link>

			<div className="absolute top-4 right-4">
				<ThemeToggle />
			</div>

			{/* Main Content */}
			<div className="flex-1 flex items-center justify-center p-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="w-full max-w-md space-y-6"
				>
					{children}
				</motion.div>
			</div>
		</div>
	);
}
