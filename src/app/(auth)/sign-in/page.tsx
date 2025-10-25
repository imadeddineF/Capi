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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, Github, Chrome } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { useLogin } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function SignIn() {
	const [showPassword, setShowPassword] = React.useState(false);
	const [formData, setFormData] = React.useState({
		email: "",
		password: "",
		rememberMe: false,
	});

	const loginMutation = useLogin();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.email || !formData.password) {
			toast.error("Please fill in all fields");
			return;
		}

		loginMutation.mutate(
			{ email: formData.email, password: formData.password },
			{
				onSuccess: (data) => {
					if (data.success) {
						toast.success("Login successful!");
					} else {
						toast.error(data.error || "Login failed");
					}
				},
				onError: () => {
					toast.error("Login failed. Please try again.");
				},
			}
		);
	};

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	return (
		<AuthLayout
			title="Welcome back"
			subtitle="Enter your credentials to access your account"
		>
			{/* Sign In Card */}
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3, delay: 0.2 }}
			>
				<Card className="border-border/50 shadow-lg">
					<CardHeader className="space-y-1 pb-4">
						<CardTitle className="text-2xl">Sign in</CardTitle>
						<CardDescription className="text-base">
							Enter your email and password to continue
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
										value={formData.email}
										onChange={(e) =>
											handleInputChange("email", e.target.value)
										}
										className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
										required
										disabled={loginMutation.isPending}
									/>
								</div>
							</div>

							{/* Password Field */}
							<div className="space-y-2">
								<Label htmlFor="password" className="text-sm font-medium">
									Password
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={formData.password}
										onChange={(e) =>
											handleInputChange("password", e.target.value)
										}
										className="pl-10 pr-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
										required
										disabled={loginMutation.isPending}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-accent/50"
										onClick={() => setShowPassword(!showPassword)}
										disabled={loginMutation.isPending}
									>
										{showPassword ? (
											<EyeOff className="w-4 h-4" />
										) : (
											<Eye className="w-4 h-4" />
										)}
									</Button>
								</div>
							</div>

							{/* Remember Me & Forgot Password */}
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="remember"
										checked={formData.rememberMe}
										onCheckedChange={(checked: boolean | string) =>
											handleInputChange("rememberMe", checked as boolean)
										}
										disabled={loginMutation.isPending}
									/>
									<Label
										htmlFor="remember"
										className="text-sm font-normal cursor-pointer"
									>
										Remember me
									</Label>
								</div>
								<Link
									href="/forgot-password"
									className="text-sm text-primary hover:underline transition-all"
								>
									Forgot password?
								</Link>
							</div>

							{/* Sign In Button */}
							<Button
								type="submit"
								className="w-full h-11 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25 transition-all duration-200"
								disabled={loginMutation.isPending}
							>
								{loginMutation.isPending ? (
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
										Signing in...
									</div>
								) : (
									"Sign in"
								)}
							</Button>
						</form>

						{/* Divider */}
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<Separator className="w-full" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-card px-3 text-muted-foreground font-medium">
									Or continue with
								</span>
							</div>
						</div>

						{/* Social Buttons */}
						<div className="grid grid-cols-2 gap-3">
							<Button
								variant="outline"
								className="w-full h-11 hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200"
								disabled={loginMutation.isPending}
							>
								<Github className="w-4 h-4 mr-2" />
								GitHub
							</Button>
							<Button
								variant="outline"
								className="w-full h-11 hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200"
								disabled={loginMutation.isPending}
							>
								<Chrome className="w-4 h-4 mr-2" />
								Google
							</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Sign Up Link */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3, delay: 0.3 }}
				className="text-center text-sm"
			>
				<span className="text-muted-foreground">
					Don't have an account?{" "}
				</span>
				<Link
					href="/sign-up"
					className="text-primary hover:underline font-medium transition-all"
				>
					Sign up
				</Link>
			</motion.div>
		</AuthLayout>
	);
}
