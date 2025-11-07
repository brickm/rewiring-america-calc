import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Electrification Nation - Heat Pump Calculator",
  description: "Calculate your annual savings by switching to a heat pump with Rewiring America",
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
