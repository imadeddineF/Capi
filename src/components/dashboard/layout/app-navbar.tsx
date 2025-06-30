"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/shared/mode-toggle-btn";

export const DashboardNavbar = () => {
	const pathName = usePathname();
	const [sessionName, setSessionName] = useState<string>(pathName);

	console.log(pathName);

	useEffect(() => {
		// Regex to strip locale prefix like '/fr' or '/en' at the start of the path
		const pathWithoutLocale = pathName.replace(/^\/(fr|en)(?=\/)/, "");

		// Remove '/dashboard' and any leading slash
		const cleanPath = pathWithoutLocale
			.replace("/dashboard", "")
			.replace(/^\/+/, "");

		const readableName = cleanPath
			? cleanPath
					.split("/")
					.join(" ") // Convert subpaths to spaced words
					.split("-")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" ")
			: "Overview";

		setSessionName(readableName);
	}, [pathName]);

	return (
		<nav className="relative w-full z-30 border-b h-20 flex items-center justify-between gap-1 px-6">
			<div className="flex items-center gap-3">
				<SidebarTrigger className="md:hidden" />
				<h1 className="capitalize font-bold">{sessionName}</h1>
			</div>
			<div className="flex items-center gap-3">
				<ModeToggle />
			</div>
		</nav>
	);
};
