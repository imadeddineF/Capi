"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome } from "lucide-react";
import { ModeToggle } from "@/components/shared/mode-toggle-btn";
import Image from "next/image";
import logoIcon from "../../../../public/logo-icon.svg";
import logoText from "../../../../public/logo-text.svg";

export default function SignUp() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		agreeToTerms: false,
		subscribeNewsletter: false,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		
		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			// Handle sign up logic here
		}, 2000);
	};

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const passwordsMatch = formData.password === formData.confirmPassword;
	const isFormValid = formData.firstName && formData.lastName && formData.email && 
					   formData.password && formData.confirmPassword && 
					   passwordsMatch && formData.agreeToTerms;

	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Header */}
			<header className="flex items-center justify-between p-6 border-b">
				<div className="flex items-center gap-2">
					<Image src={logoIcon} alt="Logo" className="h-8 w-8" />
					<Image src={logoText} alt="Logo Text" className="h-7" />
				</div>
				<ModeToggle />
			</header>

			{/* Main Content */}
			<div className="flex-1 flex items-center justify-center p-6">
				<div className="w-full max-w-md space-y-6">
					{/* Welcome Text */}
					<div className="text-center space-y-2">
						<h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
						<p className="text-muted-foreground">
							Join us and start your journey today
						</p>
					</div>

					{/* Sign Up Card */}
					<Card className="border-border/50">
						<CardHeader className="space-y-1">
							<CardTitle className="text-xl">Sign up for free</CardTitle>
							<CardDescription>
								Fill in your details to create your account
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<form onSubmit={handleSubmit} className="space-y-4">
								{/* Name Fields */}
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-2">
										<Label htmlFor="firstName">First name</Label>
										<div className="relative">
											<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
											<Input
												id="firstName"
												type="text"
												placeholder="John"
												value={formData.firstName}
												onChange={(e) => handleInputChange("firstName", e.target.value)}
												className="pl-10"
												required
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="lastName">Last name</Label>
										<div className="relative">
											<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
											<Input
												id="lastName"
												type="text"
												placeholder="Doe"
												value={formData.lastName}
												onChange={(e) => handleInputChange("lastName", e.target.value)}
												className="pl-10"
												required
											/>
										</div>
									</div>
								</div>

								{/* Email Field */}
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
										<Input
											id="email"
											type="email"
											placeholder="john.doe@example.com"
											value={formData.email}
											onChange={(e) => handleInputChange("email", e.target.value)}
											className="pl-10"
											required
										/>
									</div>
								</div>

								{/* Password Field */}
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="Create a strong password"
											value={formData.password}
											onChange={(e) => handleInputChange("password", e.target.value)}
											className="pl-10 pr-10"
											required
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
											onClick={() => setShowPassword(!showPassword)}
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
									<Label htmlFor="confirmPassword">Confirm password</Label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
										<Input
											id="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											placeholder="Confirm your password"
											value={formData.confirmPassword}
											onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
											className={`pl-10 pr-10 ${formData.confirmPassword && !passwordsMatch ? 'border-destructive' : ''}`}
											required
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										>
											{showConfirmPassword ? (
												<EyeOff className="w-4 h-4" />
											) : (
												<Eye className="w-4 h-4" />
											)}
										</Button>
									</div>
									{formData.confirmPassword && !passwordsMatch && (
										<p className="text-sm text-destructive">
											Passwords do not match
										</p>
									)}
								</div>

								{/* Checkboxes */}
								<div className="space-y-3">
									<div className="flex items-start space-x-2">
										<Checkbox
											id="agreeToTerms"
											checked={formData.agreeToTerms}
											onCheckedChange={(checked) => 
												handleInputChange("agreeToTerms", checked as boolean)
											}
											className="mt-1"
										/>
										<Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
											I agree to the{" "}
											<Link href="/terms" className="text-primary hover:underline">
												Terms of Service
											</Link>{" "}
											and{" "}
											<Link href="/privacy" className="text-primary hover:underline">
												Privacy Policy
											</Link>
										</Label>
									</div>
									<div className="flex items-start space-x-2">
										<Checkbox
											id="subscribeNewsletter"
											checked={formData.subscribeNewsletter}
											onCheckedChange={(checked) => 
												handleInputChange("subscribeNewsletter", checked as boolean)
											}
											className="mt-1"
										/>
										<Label htmlFor="subscribeNewsletter" className="text-sm leading-relaxed">
											I want to receive updates about new features and products
										</Label>
									</div>
								</div>

								{/* Sign Up Button */}
								<Button
									type="submit"
									className="w-full bg-hiki hover:bg-hiki/90"
									disabled={isLoading || !isFormValid}
								>
									{isLoading ? (
										<div className="flex items-center gap-2">
											<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											Creating account...
										</div>
									) : (
										"Create account"
									)}
								</Button>
							</form>

							{/* Divider */}
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<Separator className="w-full" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>

							{/* Social Buttons */}
							<div className="grid grid-cols-2 gap-3">
								<Button variant="outline" className="w-full">
									<Github className="w-4 h-4 mr-2" />
									GitHub
								</Button>
								<Button variant="outline" className="w-full">
									<Chrome className="w-4 h-4 mr-2" />
									Google
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Sign In Link */}
					<div className="text-center text-sm">
						<span className="text-muted-foreground">Already have an account? </span>
						<Link href="/sign-in" className="text-primary hover:underline font-medium">
							Sign in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
