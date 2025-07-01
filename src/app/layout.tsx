import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { NetworkProvider } from "@/providers/network-provider";
import ReactQueryProvider from "@/providers/react-query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Capi",
  description: "An AI assistant for your projects data.",
  icons: {
    icon: '/logo-icon.svg', 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NetworkProvider>
            <ReactQueryProvider>
              <AuthProvider>
                {children}
                <Toaster position="top-right" richColors closeButton />
              </AuthProvider>
            </ReactQueryProvider>
          </NetworkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
