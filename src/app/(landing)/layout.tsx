"use client";

import React from "react";

export default function LandingPageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <main className="">{children}</main>;
}
