"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { ModeToggle } from "@/components/shared/mode-toggle-btn";
import Image from "next/image";
import logoIcon from "../../../../public/logo-icon.svg";
import logoText from "../../../../public/logo-text.svg";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle sign in logic here
    }, 2000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Sign In Card */}
          <Card className="border-border/50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Sign in to your account</CardTitle>
              <CardDescription>
                Enter your email and password to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
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
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        handleInputChange("rememberMe", checked as boolean)
                      }
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full bg-hiki hover:bg-hiki/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
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

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              href="/sign-up"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
