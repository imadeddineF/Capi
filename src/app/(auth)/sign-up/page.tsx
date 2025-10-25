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
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { useRegister } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function SignUp() {
	const [showPassword, setShowPassword] = React.useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
	const [formData, setFormData] = React.useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		agreeToTerms: false,
		subscribeNewsletter: false,
	});

	const registerMutation = useRegister();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isFormValid) {
			toast.error("Please fill in all required fields and agree to terms");
			return;
		}

		if (!passwordsMatch) {
			toast.error("Passwords do not match");
			return;
		}

		const name = `${formData.firstName} ${formData.lastName}`.trim();

		registerMutation.mutate(
			{ name, email: formData.email, password: formData.password },
			{
				onSuccess: (data) => {
					if (data.success) {
						toast.success("Registration successful! Please sign in.");
					} else {
						toast.error(data.error || "Registration failed");
					}
				},
				onError: () => {
					toast.error("Registration failed. Please try again.");
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

	const passwordsMatch = formData.password === formData.confirmPassword;
	const isFormValid =
		formData.firstName &&
		formData.lastName &&
		formData.email &&
		formData.password &&
		formData.confirmPassword &&
		passwordsMatch &&
		formData.agreeToTerms;

	return (
		<AuthLayout
			title="Create your account"
			subtitle="Join us and start your journey today"
		>
			{/* Sign Up Card */}
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3, delay: 0.2 }}
			>
				<Card className="border-border/50 shadow-lg">
					<CardHeader className="space-y-1 pb-4">
						<CardTitle className="text-2xl">Sign up</CardTitle>
						<CardDescription className="text-base">
							Fill in your details to create your account
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Name Fields */}
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-2">
									<Label htmlFor="firstName" className="text-sm font-medium">
										First name
									</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
										<Input
											id="firstName"
											type="text"
											placeholder="John"
											value={formData.firstName}
											onChange={(e) =>
												handleInputChange("firstName", e.target.value)
											}
											className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
											required
											disabled={registerMutation.isPending}
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="lastName" className="text-sm font-medium">
										Last name
									</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
										<Input
											id="lastName"
											type="text"
											placeholder="Doe"
											value={formData.lastName}
											onChange={(e) =>
												handleInputChange("lastName", e.target.value)
											}
											className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
											required
											disabled={registerMutation.isPending}
										/>
									</div>
								</div>
							</div>

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
										disabled={registerMutation.isPending}
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
										placeholder="Create a strong password"
										value={formData.password}
										onChange={(e) =>
											handleInputChange("password", e.target.value)
										}
										className="pl-10 pr-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
										required
										disabled={registerMutation.isPending}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-accent/50"
										onClick={() => setShowPassword(!showPassword)}
										disabled={registerMutation.isPending}
									>
										{showPassword ? (
											<EyeOff className="w-4 h-4" />
										) : (
											<Eye className="w-4 h-4" />
										)}
									</Button>
								</div>
							</div>

							{/* Confirm Password Field */}
							<div className="space-y-2">
								<Label htmlFor="confirmPassword" className="text-sm font-medium">
									Confirm password
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
									<Input
										id="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										placeholder="Confirm your password"
										value={formData.confirmPassword}
										onChange={(e) =>
											handleInputChange("confirmPassword", e.target.value)
										}
										className={`pl-10 pr-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${
											formData.confirmPassword && !passwordsMatch
												? "border-destructive focus:ring-destructive/20"
												: ""
										}`}
										required
										disabled={registerMutation.isPending}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-accent/50"
										onClick={() =>
											setShowConfirmPassword(!showConfirmPassword)
										}
										disabled={registerMutation.isPending}
									>
										{showConfirmPassword ? (
											<EyeOff className="w-4 h-4" />
										) : (
											<Eye className="w-4 h-4" />
										)}
									</Button>
								</div>
								{formData.confirmPassword && !passwordsMatch && (
									<motion.p
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className="text-sm text-destructive"
									>
										Passwords do not match
									</motion.p>
								)}
							</div>

							{/* Terms and Newsletter */}
							<div className="space-y-3 pt-2">
								<div className="flex items-start space-x-2">
									<Checkbox
										id="terms"
										checked={formData.agreeToTerms}
										onCheckedChange={(checked) =>
											handleInputChange("agreeToTerms", checked as boolean)
										}
										disabled={registerMutation.isPending}
										className="mt-0.5"
									/>
									<Label
										htmlFor="terms"
										className="text-sm font-normal leading-relaxed cursor-pointer"
									>
										I agree to the{" "}
										<Link
											href="/terms"
											className="text-primary hover:underline font-medium"
										>
											Terms of Service
										</Link>{" "}
										and{" "}
										<Link
											href="/privacy"
											className="text-primary hover:underline font-medium"
										>
											Privacy Policy
										</Link>
									</Label>
								</div>
								<div className="flex items-start space-x-2">
									<Checkbox
										id="newsletter"
										checked={formData.subscribeNewsletter}
										onCheckedChange={(checked) =>
											handleInputChange(
												"subscribeNewsletter",
												checked as boolean
											)
										}
										disabled={registerMutation.isPending}
										className="mt-0.5"
									/>
									<Label
										htmlFor="newsletter"
										className="text-sm font-normal leading-relaxed cursor-pointer"
									>
										Subscribe to our newsletter for updates
									</Label>
								</div>
							</div>

							{/* Sign Up Button */}
							<Button
								type="submit"
								className="w-full h-11 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25 transition-all duration-200"
								disabled={!isFormValid || registerMutation.isPending}
							>
								{registerMutation.isPending ? (
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
										Creating account...
									</div>
								) : (
									"Create account"
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
								disabled={registerMutation.isPending}
							>
								<Github className="w-4 h-4 mr-2" />
								GitHub
							</Button>
							<Button
								variant="outline"
								className="w-full h-11 hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200"
								disabled={registerMutation.isPending}
							>
								<Chrome className="w-4 h-4 mr-2" />
								Google
							</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Sign In Link */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3, delay: 0.3 }}
				className="text-center text-sm"
			>
				<span className="text-muted-foreground">
					Already have an account?{" "}
				</span>
				<Link
					href="/sign-in"
					className="text-primary hover:underline font-medium transition-all"
				>
					Sign in
				</Link>
			</motion.div>
		</AuthLayout>
	);
}
