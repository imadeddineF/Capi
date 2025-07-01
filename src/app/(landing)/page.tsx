"use client";

import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import Image from "next/image";
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

// Navigation data
const navItems = [
  { label: "Home", hasDropdown: false },
  { label: "Features", hasDropdown: true },
  { label: "How it works", hasDropdown: false },
  { label: "Pricing", hasDropdown: true },
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
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
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
    answer:
      "You can connect databases, spreadsheets, cloud storage, and popular business tools like Salesforce, Google Analytics, and more.",
  },
  {
    question: "How secure is my data on your platform?",
    answer:
      "We use enterprise-grade encryption and security protocols to ensure your data is always protected.",
  },
  {
    question: "Can I customize the AI agents for my industry?",
    answer:
      "Yes, our Professional and Enterprise plans allow for customization of AI agents to your specific industry needs.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We offer chat support for all plans, with dedicated account managers for Enterprise customers.",
  },
  {
    question: "Is there a limit to how many questions I can ask?",
    answer:
      "Each plan has different limits on AI analyses per month, with Enterprise offering unlimited usage.",
  },
];

// Pricing plans
const pricingPlans = [
  {
    name: "Free Trial",
    description: "Perfect For Testing Our Platform",
    price: "0",
    color: "#55c1b3",
    buttonText: "Get Started",
    buttonStyle: "secondary" as const,
    popular: false,
    features: [
      "Up to 3 team members",
      "5 data source connections",
      "100 AI analyses per month",
      "Standard workflows",
      "Basic multi-agent insights",
    ],
  },
  {
    name: "Professional",
    description: "Perfect For Growing Businesses",
    price: "149",
    color: "#a965f8",
    buttonText: "Get Started",
    buttonStyle: "primary" as const,
    popular: true,
    features: [
      "Up to 15 team members",
      "Unlimited data connections",
      "Real-time analytics and insights",
      "2,000 AI analyses per month",
      "Advanced multi-agent reasoning",
      "Custom workflow templates",
      "24/7 chat support",
      "All integrations included",
      "Custom R script library",
      "Advanced reporting",
    ],
  },
  {
    name: "Enterprise",
    description: "Perfect For Large Organizations With Specific Needs",
    price: "Custom",
    color: "#55c1b3",
    buttonText: "Contact Sales",
    buttonStyle: "secondary" as const,
    popular: false,
    features: [
      "Unlimited team members",
      "Unlimited everything",
      "Custom AI agent training",
      "On-premise deployment",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantees",
      "Advanced security features",
      "Custom training & onboarding",
    ],
  },
];

// Social links
const socialLinks = [
  {
    id: "email",
    icon: "/placeholder.svg?height=20&width=20",
    bgColor: "bg-gray-800",
  },
  {
    id: "facebook",
    icon: "/placeholder.svg?height=20&width=20",
    bgColor: "bg-purple-500",
  },
  {
    id: "twitter",
    icon: "/placeholder.svg?height=20&width=20",
    bgColor: "bg-gray-800",
  },
  {
    id: "linkedin",
    icon: "/placeholder.svg?height=20&width=20",
    bgColor: "bg-gray-800",
  },
];

// Navigation links for footer
const footerNavLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#" },
  { label: "How it works", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "F&Q", href: "#" },
];

// Header Component
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-[#090013] to-[#8f34fb] rounded-b-[2rem]">
      {/* Ripple Background */}
      <div className="absolute inset-0">
        <Ripple />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-white font-semibold text-lg">Capi</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-1">
                <Link
                  href="#"
                  className="text-white/90 hover:text-white transition-colors text-sm font-medium"
                >
                  {item.label}
                </Link>
                {item.hasDropdown && (
                  <ChevronDown className="w-4 h-4 text-white/70" />
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              className="text-white border border-white/30 hover:bg-white/10 rounded-full px-6"
            >
              Log-in
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-full px-6">
              Sign-up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  className="text-white/90 hover:text-white transition-colors text-sm font-medium py-2"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                <Button
                  variant="ghost"
                  className="text-white border border-white/30 hover:bg-white/10 rounded-full"
                >
                  Log-in
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-full">
                  Sign-up
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Transform Data Into
          <br />
          Actionable Insights
        </h1>
        <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
          Empower your business with real-time AI insights. Turn your data into
          action with generative AI, statistics, and smart business reasoning.
        </p>

        <ShimmerButton className="!bg-gradient-to-r from-purple-600 to-purple-800 mx-auto">
          Get Started Now
          <ChevronDown className="w-5 h-5 ml-2 rotate-[-45deg]" />
        </ShimmerButton>
      </div>

      {/* Hero Image */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative rounded-xl overflow-hidden shadow-2xl">
          <Image
            src={bgImg}
            alt="Dashboard Preview"
            width={1200}
            height={600}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090013] via-transparent to-transparent" />
        </div>
      </div>
    </header>
  );
}

// Features Section with Bento Grid
function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090013] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#8f34fb] rounded-full blur-[150px] opacity-30" />

      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
            Everything you need to turn your business data into competitive
            advantage
          </p>
        </div>

        <BentoGrid className="mx-auto max-w-4xl">
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
    <section className="py-16 bg-[#090013] relative overflow-hidden">
      <div className="relative">
        <VelocityScroll
          defaultVelocity={1}
          className="font-display text-center text-4xl font-bold tracking-[-0.02em] text-white drop-shadow-sm md:text-7xl md:leading-[5rem]"
        >
          Transform • Analyze • Optimize • Scale •
        </VelocityScroll>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#090013]"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#090013]"></div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090013] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#8f34fb] rounded-full blur-[150px] opacity-30" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-white/70">
            From data to decisions in four simple steps
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 via-purple-500 to-transparent" />

          <div className="space-y-16 lg:space-y-24">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  step.position === "right" ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50" />

                {/* Content */}
                <div className="flex-1 max-w-md">
                  <Card className="bg-white/5 backdrop-blur-md border-white/10 rounded-3xl p-8">
                    <CardContent className="p-0 space-y-4">
                      <span className="text-sm font-medium text-purple-400 uppercase tracking-wider">
                        {step.step}
                      </span>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white">
                        {step.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Spacer for timeline */}
                <div className="hidden lg:block flex-1" />
              </div>
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090013]">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-white/70">
            Answers to your most common questions; all in one place.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white/5 backdrop-blur-md border-white/10 rounded-2xl px-6 border-0"
            >
              <AccordionTrigger className="text-white text-lg font-medium hover:no-underline py-6">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-base leading-relaxed pb-6">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090013] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#8f34fb] rounded-full blur-[200px] opacity-20" />

      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Choose your Plan
          </h2>
          <p className="text-lg sm:text-xl text-white/70 mb-8">
            Choose the Perfect Plan to Fit Your IoT Needs and Scale with Ease
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-lg ${
                billingCycle === "monthly" ? "text-white" : "text-white/50"
              }`}
            >
              Monthly
            </span>
            <Switch
              checked={billingCycle === "annually"}
              onCheckedChange={(checked: any) =>
                setBillingCycle(checked ? "annually" : "monthly")
              }
            />
            <span
              className={`text-lg ${
                billingCycle === "annually" ? "text-white" : "text-white/50"
              }`}
            >
              Annually
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-white/5 backdrop-blur-md border-white/10 rounded-3xl p-8 ${
                plan.popular
                  ? "ring-2 ring-purple-500 shadow-2xl shadow-purple-500/20 scale-105"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardContent className="p-0 space-y-8">
                <div>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: plan.color }}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-white/70">{plan.description}</p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-white">
                    {plan.price === "Custom" ? "Custom" : `$${plan.price}`}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-white/50 ml-2">/month</span>
                  )}
                </div>

                <Button
                  className={`w-full rounded-full py-3 text-lg font-semibold ${
                    plan.buttonStyle === "primary"
                      ? "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  {plan.buttonText}
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: plan.color }}
                      >
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-white/80 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090013] text-center">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          Ready to Transform Your Data?
        </h2>
        <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
          Join hundreds of businesses already using InsightOps AI to make
          smarter decisions
        </p>
        <div className="relative inline-block">
          <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-full px-12 py-4 text-xl font-bold shadow-2xl shadow-purple-500/30">
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-[#090013] border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-white font-semibold text-xl">Capi</span>
            </div>
            <p className="text-white/60 max-w-md">
              Transform your business data into actionable insights with
              AI-powered analytics and intelligent automation.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">CONTACT US</h3>
            <div className="space-y-2">
              <Link
                href="tel:+213684575145"
                className="block text-white/60 hover:text-white transition-colors"
              >
                (+213) 684575145
              </Link>
              <Link
                href="mailto:contact@capi.com"
                className="block text-white/60 hover:text-white transition-colors"
              >
                contact@capi.com
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">FOLLOW US</h3>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.id}
                  variant="ghost"
                  size="icon"
                  className={`${social.bgColor} hover:opacity-80 rounded-full w-10 h-10`}
                >
                  <Image
                    src={social.icon || "/placeholder.svg"}
                    alt={social.id}
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="border-t border-white/10 pt-8">
          <nav className="flex flex-wrap justify-center gap-8 mb-8">
            {footerNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <div className="text-center text-white/40 text-sm">
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <FeaturesSection />
      <VelocityScrollSection />
      <HowItWorksSection />
      <FAQSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
