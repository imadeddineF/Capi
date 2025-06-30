import React from "react";
import { Button } from "../ui/button";
import { ArrowUpToLine } from "lucide-react";

export default function BackToTopBtn() {
	return (
		<Button
			className="rounded-full p-2 fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none"
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
		>
			<ArrowUpToLine />
		</Button>
	);
}
