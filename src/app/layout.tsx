import "@/styles/globals.css";
import { ThemeProvider } from "./providers";
import { AuthProvider } from "@/hooks/useAuth";
import LayoutClient from "./layout-client";

export const metadata = {
  title: "PhysioPrep - Physiotherapy Exam Preparation Platform",
  description: "Crack AIIMS, ESIC, DSSSB, RRB, NORCET and state PSC physiotherapist recruitment exams with gamified previous year question practice, timed mock tests, flashcards, and AI explanations.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutClient>{children}</LayoutClient>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
