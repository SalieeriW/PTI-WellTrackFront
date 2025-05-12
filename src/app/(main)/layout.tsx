import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "WellTrack",
  description: "WellTrack",
};

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import AppNavbar from "@/components/app-navbar";
import CustomSessionProvider from "@/components/auth/session-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  // If no session, redirect to sign-in page
  if (!session) {
    redirect("/login");
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-full`}
      >
        <CustomSessionProvider session={session}>
          <SidebarProvider>
            <AppSidebar />
            <AppNavbar>{children}</AppNavbar>
          </SidebarProvider>
          <Toaster />
        </CustomSessionProvider>
      </body>
    </html>
  );
}
