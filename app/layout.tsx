import type { Metadata } from "next";
import { Press_Start_2P, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const monoFont = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CivicArcade — Community Hero",
  description: "Hyperlocal gamified civic infrastructure platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pixelFont.variable} ${monoFont.variable}`}>
      <body className="bg-hud-bg text-neon-green font-mono antialiased overflow-x-hidden">
        {/* CRT scanline overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-[0.03]">
          <div className="animate-scanline absolute w-full h-0.5 bg-white" />
        </div>
        {children}
      </body>
    </html>
  );
}