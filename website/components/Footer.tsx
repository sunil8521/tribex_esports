import {
  FaDiscord,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const socialLinks = [
    {
      icon: FaDiscord,
      href: "https://discord.gg/pbFZQMWYQu",
      label: "Discord",
      color: "hover:text-[#5865F2]",
      shadow: "hover:drop-shadow-[0_0_10px_rgba(88,101,242,0.5)]",
    },
    {
      icon: FaXTwitter,
      href: "https://x.com/TribeXesports",
      label: "X (Twitter)",
      color: "hover:text-foreground",
      shadow: "hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/tribexesports",
      label: "Instagram",
      color: "hover:text-[#E1306C]",
      shadow: "hover:drop-shadow-[0_0_10px_rgba(225,48,108,0.5)]",
    },
    {
      icon: FaWhatsapp,
      href: "https://whatsapp.com/channel/0029Vb6nTSk4o7qDjcH17I1K",
      label: "WhatsApp",
      color: "hover:text-[#25D366]",
      shadow: "hover:drop-shadow-[0_0_10px_rgba(37,211,102,0.5)]",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/company/tribexesports",
      label: "LinkedIn",
      color: "hover:text-[#0A66C2]",
      shadow: "hover:drop-shadow-[0_0_10px_rgba(10,102,194,0.5)]",
    },
  ];

  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                width={36}
                height={36}
                src="/logo.png"
                alt="TribeX Logo"
                className="h-9 w-auto transition-transform duration-300 group-hover:scale-120"
              />
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-primary drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                  TribeX
                </span>
                <span className="text-foreground">eSports</span>
              </h1>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The ultimate platform for competitive gaming. Join the tribe,
              compete in tournaments, and rise to the top.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/tournaments" className="transition-colors hover:text-primary">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="transition-colors hover:text-primary">
                  Leaderboards
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-primary">
                  Teams
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="transition-colors hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Community
            </h4>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:scale-110 ${social.color} ${social.shadow}`}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TribeX eSports. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
