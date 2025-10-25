"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { toast } from "sonner";

export default function ForgotPassword() {
	const [email, setEmail] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [isSubmitted, setIsSubmitted] = React.useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			toast.error("Please enter your email address");
			return;
		}

		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			setIsSubmitted(true);
			toast.success("Password reset link sent to your email");
		}, 1500);
	};

	if (isSubmitted) {
		return (
			<AuthLayout
				title="Check your email"
				subtitle="We've sent you a password reset link"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3, delay: 0.2 }}
				>
					<Card className="border-border/50 shadow-lg">
						<CardContent className="pt-6">
							<div className="flex flex-col items-center text-center space-y-4">
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{
										duration: 0.4,
										delay: 0.3,
										type: "spring",
									}}
									className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
								>
									<CheckCircle2 className="w-8 h-8 text-primary" />
								</motion.div>

								<div className="space-y-2">
									<h3 className="text-xl font-semibold">Email sent!</h3>
									<p className="text-muted-foreground text-sm max-w-sm">
										We've sent a password reset link to{" "}
										<span className="font-medium text-foreground">
											{email}
										</span>
										. Please check your inbox and follow the instructions.
									</p>
								</div>

								<div className="pt-4 space-y-3 w-full">
									<p className="text-sm text-muted-foreground">
										Didn't receive the email? Check your spam folder or
									</p>
									<Button
										variant="outline"
										className="w-full"
										onClick={() => {
											setIsSubmitted(false);
											setEmail("");
										}}
									>
										Try again
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3, delay: 0.4 }}
					className="text-center"
				>
					<Link
						href="/sign-in"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to sign in
					</Link>
				</motion.div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			title="Forgot password?"
			subtitle="No worries, we'll send you reset instructions"
		>
			{/* Forgot Password Card */}
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3, delay: 0.2 }}
			>
				<Card className="border-border/50 shadow-lg">
					<CardHeader className="space-y-1 pb-4">
						<CardTitle className="text-2xl">Reset password</CardTitle>
						<CardDescription className="text-base">
							Enter your email address and we'll send you a reset link
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Email Field */}
							<div className="space-y-2">
								<Label htmlFor="email" className="text-sm font-medium">
									Email
								</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
									<Input
										id="email"
										type="email"
										placeholder="name@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
										required
										disabled={isLoading}
										autoFocus
									/>
								</div>
							</div>

							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full h-11 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25 transition-all duration-200"
								disabled={isLoading}
							>
								{isLoading ? (
									<div className="flex items-center gap-2">
										<motion.div
											animate={{ rotate: 360 }}
											transition={{
												duration: 1,
												repeat: Infinity,
												ease: "linear",
											}}
											className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
										/>
										Sending...
									</div>
								) : (
									"Send reset link"
								)}
							</Button>
						</form>
					</CardContent>
				</Card>
			</motion.div>

			{/* Back to Sign In Link */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3, delay: 0.3 }}
				className="text-center"
			>
				<Link
					href="/sign-in"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to sign in
				</Link>
			</motion.div>
		</AuthLayout>
	);
}
