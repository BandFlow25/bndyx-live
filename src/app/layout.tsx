// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import BndyThinFooter  from "@/components/BndyThinFooter";
import { ViewToggleProvider } from "@/context/ViewToggleContext";
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: "bndy.live",
  description: "Discover live music events near you",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen m-0 p-0">
        <AuthProvider>
          <ViewToggleProvider>
            <Header />
            <main className="flex-1 mt-[88px] p-0 flex flex-col">
              {children}
            </main>
            <BndyThinFooter  />
          </ViewToggleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}