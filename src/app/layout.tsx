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
    "Done-for-you patient acquisition system for clinics. We guarantee 30 to 50 booked patient appointments in 90 days, or you don't pay.",
  metadataBase: new URL("https://www.northsend.io"),
  applicationName: "NorthSend",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "NorthSend",
    title: "NorthSend. Booked patients. Guaranteed in 90 days.",
    description:
      "Done-for-you patient acquisition system for clinics. We guarantee 30 to 50 booked patient appointments in 90 days, or you don't pay.",
    type: "website",
    url: "https://www.northsend.io",
  },
};

/* Tells Google the NorthSend brand entity: official name, the "North send"
   spelling variant, and the canonical www host. */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.northsend.io/#organization",
      name: "NorthSend",
      alternateName: ["North Send", "NorthSend.io"],
      url: "https://www.northsend.io",
      logo: "https://www.northsend.io/apple-icon.png",
      description:
        "Done-for-you patient acquisition system for clinics. Booked patients, guaranteed in 90 days.",
      foundingDate: "2024",
      founder: { "@type": "Person", name: "Charlie Tay" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kuala Lumpur",
        addressCountry: "MY",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.northsend.io/#website",
      url: "https://www.northsend.io",
      name: "NorthSend",
      alternateName: "North Send",
      publisher: { "@id": "https://www.northsend.io/#organization" },
    },
  ],
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
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
