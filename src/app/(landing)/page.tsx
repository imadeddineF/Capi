"use client";

import * as React from "react";
import { useState } from "react";
import {
	ChevronDown,
	Menu,
	X,
	Facebook,
	Twitter,
	Linkedin,
	GithubIcon,
	ArrowRight,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Ripple } from "@/components/magicui/ripple";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { Marquee } from "@/components/magicui/marquee";
import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import AnimatedBeamMultipleOutputDemo from "@/components/landing/animated-beam-multiple-outputs";
import AnimatedListDemo from "@/components/landing/animated-list-demo";
import bgImg from "../../../public/imgs/Frame 1707479299.png";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import logoIcon from "../../../public/logo-icon.svg";
import logoText from "../../../public/logo-text.svg";
import logoTextDark from "../../../public/logo-text-dark.svg";
import { useTheme } from "next-themes";

// Navigation data
const navItems = [
	{ label: "Home", hasDropdown: false },
	{ label: "Features", hasDropdown: true },
	{ label: "How it works", hasDropdown: false },
	{ label: "F&Q", hasDropdown: false },
];

// Files data for marquee
const files = [
	{
		name: "bitcoin.pdf",
		body: "Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.",
	},
	{
		name: "finances.xlsx",
		body: "A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.",
	},
	{
		name: "logo.svg",
		body: "Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.",
	},
	{
		name: "keys.gpg",
		body: "GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.",
	},
	{
		name: "seed.txt",
		body: "A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.",
	},
];

// Bento grid features
const features = [
	{
		Icon: FileTextIcon,
		name: "Save your files",
		description: "We automatically save your files as you type.",
		href: "#",
		cta: "Learn more",
		className: "col-span-3 lg:col-span-1",
		background: (
			<Marquee
				pauseOnHover
				className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
			>
				{files.map((f, idx) => (
					<figure
						key={idx}
						className={cn(
							"relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
							"border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
							"dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
							"transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
						)}
					>
						<div className="flex flex-row items-center gap-2">
							<div className="flex flex-col">
								<figcaption className="text-sm font-medium dark:text-white ">
									{f.name}
								</figcaption>
							</div>
						</div>
						<blockquote className="mt-2 text-xs">
							{f.body}
						</blockquote>
					</figure>
				))}
			</Marquee>
		),
	},
	{
		Icon: BellIcon,
		name: "Notifications",
		description: "Get notified when something happens.",
		href: "#",
		cta: "Learn more",
		className: "col-span-3 lg:col-span-2",
		background: (
			<AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90" />
		),
	},
	{
		Icon: Share2Icon,
		name: "Integrations",
		description: "Supports 100+ integrations and counting.",
		href: "#",
		cta: "Learn more",
		className: "col-span-3 lg:col-span-2",
		background: (
			<AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
		),
	},
	{
		Icon: CalendarIcon,
		name: "Calendar",
		description: "Use the calendar to filter your files by date.",
		className: "col-span-3 lg:col-span-1",
		href: "#",
		cta: "Learn more",
		background: (
			<Calendar
				mode="single"
				selected={new Date(2022, 4, 11, 0, 0, 0)}
				className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-90"
			/>
		),
	},
];

// How it works steps
const howItWorksSteps = [
	{
		step: "STEP 1",
		title: "Connect Your Data",
		description:
			"Link databases, upload files, or connect your favorite business tools",
		position: "left" as const,
	},
	{
		step: "STEP 2",
		title: "Ask Questions",
		description:
			"Type business questions in natural language - our AI understands context",
		position: "right" as const,
	},
	{
		step: "STEP 3",
		title: "Get AI Insights",
		description:
			"Multi-agent system analyzes data and provides domain-specific recommendations",
		position: "left" as const,
	},
	{
		step: "STEP 4",
		title: "Take Action",
		description:
			"Generate workflows, assign tasks, and track progress with your team",
		position: "right" as const,
	},
];

// FAQ data
const faqItems = [
	{
		question: "What types of data sources can I connect?",
		answer: "You can connect databases, spreadsheets, cloud storage, and popular business tools like Salesforce, Google Analytics, and more.",
	},
	{
		question: "How secure is my data on your platform?",
		answer: "We use enterprise-grade encryption and security protocols to ensure your data is always protected.",
	},
	{
		question: "Can I customize the AI agents for my industry?",
		answer: "Yes, our Professional and Enterprise plans allow for customization of AI agents to your specific industry needs.",
	},
	{
		question: "What kind of support do you offer?",
		answer: "We offer chat support for all plans, with dedicated account managers for Enterprise customers.",
	},
	{
		question: "Is there a limit to how many questions I can ask?",
		answer: "Each plan has different limits on AI analyses per month, with Enterprise offering unlimited usage.",
	},
];

// Social links
const socialLinks = [
	{
		id: "github",
		icon: GithubIcon,
		href: "https://github.com",
		label: "GitHub",
		bgColor: "bg-gray-800 hover:bg-gray-700",
	},
	{
		id: "twitter",
		icon: Twitter,
		href: "https://twitter.com",
		label: "Twitter",
		bgColor: "bg-blue-500 hover:bg-blue-600",
	},
	{
		id: "linkedin",
		icon: Linkedin,
		href: "https://linkedin.com",
		label: "LinkedIn",
		bgColor: "bg-blue-700 hover:bg-blue-800",
	},
	{
		id: "facebook",
		icon: Facebook,
		href: "https://facebook.com",
		label: "Facebook",
		bgColor: "bg-blue-600 hover:bg-blue-700",
	},
];

// Navigation links for footer
const footerNavLinks = [
	{ label: "Home", href: "#" },
	{ label: "Features", href: "#" },
	{ label: "How it works", href: "#" },
	{ label: "F&Q", href: "#" },
];

// Header Component
export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<header className="relative w-full min-h-screen overflow-hidden bg-black">
			<div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black opacity-90" />
			<div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-transparent to-violet-600/5" />

			{/* Ripple Background */}
			<div className="absolute inset-0">
				<Ripple />
			</div>

			{/* Navigation */}
			<motion.nav
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6"
			>
				<div className="flex items-center justify-between bg-white/5 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/10 shadow-2xl shadow-black/20">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-1 group">
						<Image
							src={logoIcon || "/placeholder.svg"}
							alt="Logo"
							className="h-9 w-9"
						/>
						{mounted && (
							<Image
								src={theme === "dark" ? logoTextDark : logoText}
								alt="Capi"
								className="h-6 transition-opacity duration-200"
							/>
						)}
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-1">
						{navItems.map((item, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.3,
									delay: 0.1 + index * 0.05,
								}}
								className="flex items-center space-x-1"
							>
								<Link
									href="#"
									className="text-white/80 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5"
								>
									{item.label}
								</Link>
								{item.hasDropdown && (
									<ChevronDown className="w-4 h-4 text-white/50" />
								)}
							</motion.div>
						))}
					</div>

					{/* Auth Buttons & Theme Toggle */}
					<div className="hidden md:flex items-center space-x-3">
						<ThemeToggle />
						<Link href={"/sign-in"}>
							<Button
								variant="ghost"
								className="text-white/80 hover:text-white border border-white/20 hover:bg-white/10 rounded-lg px-6 transition-all duration-200"
							>
								Log-in
							</Button>
						</Link>
						<Link href={"/sign-up"}>
							<Button className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-lg px-6 shadow-lg shadow-violet-500/30 transition-all duration-200 hover:shadow-violet-500/50">
								Sign-up
							</Button>
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<div className="flex items-center gap-3 md:hidden">
						<ThemeToggle />
						<Button
							variant="ghost"
							size="icon"
							className="text-white"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="md:hidden mt-4 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
					>
						<div className="flex flex-col space-y-4">
							{navItems.map((item, index) => (
								<Link
									key={index}
									href="#"
									className="text-white/80 hover:text-white transition-colors text-sm font-medium py-2"
								>
									{item.label}
								</Link>
							))}
							<div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
								<Link href="/sign-in">
									<Button
										variant="ghost"
										className="w-full text-white border border-white/20 hover:bg-white/10 rounded-lg"
									>
										Log-in
									</Button>
								</Link>
								<Link href="/sign-up">
									<Button className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-lg">
										Sign-up
									</Button>
								</Link>
							</div>
						</div>
					</motion.div>
				)}
			</motion.nav>

			{/* Hero Section */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center"
			>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-2 mb-8"
				>
					<Sparkles className="w-4 h-4 text-violet-400" />
					<span className="text-sm font-medium text-violet-300">
						AI-Powered Analytics Platform
					</span>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.35 }}
					className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
				>
					Transform Data Into
					<br />
					<span className="bg-gradient-to-r from-violet-400 via-violet-300 to-violet-400 bg-clip-text text-transparent">
						Actionable Insights
					</span>
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="text-lg sm:text-xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed"
				>
					Empower your business with real-time AI insights. Turn your
					data into action with generative AI, statistics, and smart
					business reasoning.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.5 }}
					className="flex flex-col sm:flex-row items-center justify-center gap-4"
				>
					<Link href={"/chat"}>
						<ShimmerButton className="!bg-gradient-to-r from-violet-600 to-violet-700">
							Get Started Now
							<ArrowRight className="w-5 h-5 ml-2" />
						</ShimmerButton>
					</Link>
					<Button
						variant="outline"
						className="border-white/20 text-white hover:bg-white/10 rounded-lg px-8 py-3 text-base font-medium bg-transparent"
					>
						Watch Demo
					</Button>
				</motion.div>
			</motion.div>

			{/* Hero Image */}
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.6 }}
				className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20"
			>
				<div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
					<Image
						src={bgImg || "/placeholder.svg"}
						alt="Dashboard Preview"
						width={1200}
						height={600}
						className="w-full h-auto"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
				</div>
			</motion.div>
		</header>
	);
}

// Features Section with Bento Grid
function FeaturesSection() {
	return (
		<section className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
			<div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-violet-600 rounded-full blur-[200px] opacity-15" />
			<div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-violet-600 rounded-full blur-[200px] opacity-10" />

			<div className="mx-auto max-w-7xl relative z-10">
				<div className="text-center mb-20">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
							Powerful Features
						</h2>
						<p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto">
							Everything you need to turn your business data into
							competitive advantage
						</p>
					</motion.div>
				</div>

				<BentoGrid className="mx-auto max-w-5xl">
					{features.map((feature, idx) => (
						<BentoCard key={idx} {...feature} />
					))}
				</BentoGrid>
			</div>
		</section>
	);
}

// Velocity Scroll Section
function VelocityScrollSection() {
	return (
		<section className="py-20 bg-black relative overflow-hidden border-y border-white/5">
			<div className="relative">
				<VelocityScroll
					defaultVelocity={1}
					className="font-display text-center text-4xl font-bold tracking-[-0.02em] text-white drop-shadow-sm md:text-6xl md:leading-[5rem]"
				>
					Transform • Analyze • Optimize • Scale •
				</VelocityScroll>
				<div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black"></div>
				<div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black"></div>
			</div>
		</section>
	);
}

// How It Works Section
function HowItWorksSection() {
	return (
		<section className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
			<div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-violet-600 rounded-full blur-[200px] opacity-10" />

			<div className="mx-auto max-w-6xl relative z-10">
				<div className="text-center mb-20">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
							How It Works
						</h2>
						<p className="text-lg sm:text-xl text-white/60">
							From data to decisions in four simple steps
						</p>
					</motion.div>
				</div>

				<div className="relative">
					{/* Timeline Line */}
					<div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-violet-500 via-violet-500/50 to-transparent" />

					<div className="space-y-16 lg:space-y-24">
						{howItWorksSteps.map((step, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.6,
									delay: index * 0.1,
								}}
								viewport={{ once: true }}
								className={`flex flex-col lg:flex-row items-center gap-8 ${
									step.position === "right"
										? "lg:flex-row-reverse"
										: ""
								}`}
							>
								{/* Timeline Dot */}
								<div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full shadow-lg shadow-violet-500/50" />

								{/* Content */}
								<div className="flex-1 max-w-md">
									<Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
										<CardContent className="p-0 space-y-4">
											<span className="text-sm font-semibold text-violet-300 uppercase tracking-widest">
												{step.step}
											</span>
											<h3 className="text-2xl lg:text-3xl font-bold text-white">
												{step.title}
											</h3>
											<p className="text-white/60 leading-relaxed">
												{step.description}
											</p>
										</CardContent>
									</Card>
								</div>

								{/* Spacer for timeline */}
								<div className="hidden lg:block flex-1" />
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

// FAQ Section
function FAQSection() {
	return (
		<section className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
			<div className="mx-auto max-w-4xl">
				<div className="text-center mb-16">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
							Frequently Asked Questions
						</h2>
						<p className="text-lg sm:text-xl text-white/60">
							Answers to your most common questions; all in one
							place.
						</p>
					</motion.div>
				</div>

				<Accordion type="single" collapsible className="space-y-3">
					{faqItems.map((item, index) => (
						<AccordionItem
							key={index}
							value={`item-${index}`}
							className="bg-white/5 backdrop-blur-xl border-white/10 rounded-xl px-6 border hover:bg-white/10 transition-all duration-200"
						>
							<AccordionTrigger className="text-white text-lg font-semibold hover:no-underline py-5">
								{item.question}
							</AccordionTrigger>
							<AccordionContent className="text-white/60 text-base leading-relaxed pb-5">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}

// CTA Section
function CTASection() {
	return (
		<section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-black text-center relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-violet-600/10 blur-3xl" />

			<div className="mx-auto max-w-4xl relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
						Ready to Transform Your Data?
					</h2>
					<p className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
						Join hundreds of businesses already using Capi AI to
						make smarter decisions
					</p>
					<Link href={"/chat"}>
						<Button className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-lg px-12 py-4 text-lg font-bold shadow-lg shadow-violet-500/30 transition-all duration-200 hover:shadow-violet-500/50">
							Get Started Now
							<ArrowRight className="w-5 h-5 ml-2" />
						</Button>
					</Link>
				</motion.div>
			</div>
		</section>
	);
}

// Footer
function Footer() {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<footer className="bg-black border-t border-white/5 py-16 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
					{/* Logo and Description */}
					<div className="lg:col-span-2">
						<Link
							href="/"
							className="flex items-center gap-3 group mb-6 w-fit"
						>
							<div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all duration-300">
								<Image
									src={logoIcon || "/placeholder.svg"}
									alt="Logo"
									className="h-6 w-6"
								/>
							</div>
							{mounted && (
								<Image
									src={
										theme === "dark"
											? logoTextDark
											: logoText
									}
									alt="Capi"
									className="h-6 transition-opacity duration-200"
								/>
							)}
						</Link>
						<p className="text-white/50 max-w-md leading-relaxed text-sm">
							Transform your business data into actionable
							insights with AI-powered analytics and intelligent
							automation.
						</p>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-white font-bold text-base mb-6 uppercase tracking-wide">
							Contact Us
						</h3>
						<div className="space-y-3">
							<Link
								href="tel:+213684575145"
								className="block text-white/50 hover:text-white transition-colors text-sm"
							>
								(+213) 684575145
							</Link>
							<Link
								href="mailto:contact@capi.com"
								className="block text-white/50 hover:text-white transition-colors text-sm"
							>
								contact@capi.com
							</Link>
						</div>
					</div>

					{/* Social Links */}
					<div>
						<h3 className="text-white font-bold text-base mb-6 uppercase tracking-wide">
							Follow Us
						</h3>
						<div className="flex space-x-3">
							{socialLinks.map((social) => {
								const IconComponent = social.icon;
								return (
									<Link
										key={social.id}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={social.label}
									>
										<Button
											variant="ghost"
											size="icon"
											className={`${social.bgColor} rounded-lg w-10 h-10 transition-all duration-200`}
										>
											<IconComponent className="w-5 h-5 text-white" />
										</Button>
									</Link>
								);
							})}
						</div>
					</div>
				</div>

				{/* Navigation Links */}
				<div className="border-t border-white/5 pt-8">
					<nav className="flex flex-wrap justify-center gap-8 mb-8">
						{footerNavLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								className="text-white/50 hover:text-white transition-colors text-sm"
							>
								{link.label}
							</Link>
						))}
					</nav>

					{/* Copyright */}
					<div className="text-center text-white/30 text-xs">
						© 2025 Capi. All rights are reserved
					</div>
				</div>
			</div>
		</footer>
	);
}

// Main Landing Page Component
export default function LandingPage() {
	return (
		<div>
			<FeaturesSection />
			<VelocityScrollSection />
			<HowItWorksSection />
			<FAQSection />
			<CTASection />
			<Footer />
		</div>
	);
}
