import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.wikia.nocookie.net" },
      { protocol: "https", hostname: "cdn.asoworld.com" },
      { protocol: "https", hostname: "images.logicalincrements.com" },
      { protocol: "https", hostname: "st1.techlusive.in" },
      { protocol: "https", hostname: "pixelz.cc" },
      { protocol: "https", hostname: "variety.com" },
      { protocol: "https", hostname: "dl.dir.freefiremobile.com" },
      { protocol: "https", hostname: "media.contentapi.ea.com" },
      { protocol: "https", hostname: "300mind.studio" },
      { protocol: "https", hostname: "upload.wikimedia.org" }
    ]
  },
};

export default nextConfig;
