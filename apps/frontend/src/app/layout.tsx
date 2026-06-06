import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { ProgressProvider } from "@/lib/progress";
import { ThemeProvider } from "@/lib/theme";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "LearnPath - Premium Software Engineering Learning Platform",
  description: "Master in-demand software engineering skills through structured roadmaps, hands-on projects, interactive quizzes, and progress tracking."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex min-h-screen flex-col bg-bg-primary font-sans antialiased">
        <ThemeProvider>
          <ProgressProvider>
            <Navbar />
            <div className="flex-1 bg-bg-primary text-text-main transition-colors duration-200">{children}</div>
            <Footer />
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
