import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NorthSend. Booked patients. Guaranteed in 90 days.",
  description:
    "Done-for-you patient acquisition system for clinics. We guarantee 10 to 30 booked patient appointments in 90 days, or you don't pay.",
  metadataBase: new URL("https://northsend.io"),
  openGraph: {
    title: "NorthSend. Booked patients. Guaranteed in 90 days.",
    description:
      "Done-for-you patient acquisition system for clinics. We guarantee 10 to 30 booked patient appointments in 90 days, or you don't pay.",
    type: "website",
    url: "https://northsend.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
