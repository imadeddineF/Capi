"use client";

import React from "react";
import { Header } from "./page";

export default function LandingPageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="min-h-screen bg-background text-foreground overflow-x-hidden">
			<Header />
			{children}
		</main>
	);
}
