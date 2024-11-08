import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import AppOnboarding from "@/components/AppOnboarding";

export const metadata: Metadata = {
  title: "Afora",
  description: "Your next all-in-one project management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
            <Header />
          <div className="flex min-h-screen pt-[74px]">
            {/* Sidebar */}
            <SignedIn>
            <Sidebar />
            {/* put the onboarding survey here to make sure no bypassing by going to another url page */}
              <AppOnboarding/>
          </SignedIn>
            <div className="flex-1 bg-gray-100 overflow-y-auto scrollbar-hide">
              {children}
            </div>
        </div>
        <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>

  );
}
