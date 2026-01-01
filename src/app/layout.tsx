import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PANDA Terminal | From Zero to Alpha",
  description: "Unlock your new edge — ideas that move markets, and tools to act on them instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

