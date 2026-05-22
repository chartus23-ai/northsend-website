import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // northsend.io/book → straight to Calendly. Use this URL on business
        // cards, email signatures, and ad UTMs so you can swap providers later
        // without breaking links.
        source: "/book",
        destination: "https://calendly.com/charlie-northsend/30min",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
