import React from "react";
import { Loader } from "lucide-react";

export default function Spinner() {
	return <Loader className="h-5 w-5 animate-spin text-gray-500" />;
}
