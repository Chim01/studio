import React from "react"
import Link from "next/link"
import { Instagram, Twitter } from "lucide-react" // Using Twitter for X icon

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { WhatsappIcon, XIcon } from "@/components/icons/social-icons" // Import custom icons


interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {}

export function SiteFooter({ className, ...props }: SiteFooterProps) {
  // Use dynamic year
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn("border-t bg-background", className)} {...props}>
      <div className="container flex flex-col items-center justify-center gap-4 py-6 md:flex-row md:justify-between">
        {/* Copyright */}
        <span className="text-sm text-foreground text-center md:order-1 ml-4"> {/* Updated margin-left and text color */}
          {siteConfig.name} © {currentYear}
        </span>

        {/* Social Media Links */}
        <div className="flex items-center gap-4 md:order-2">
          <Link
            href={siteConfig.links.whatsapp || "#"} // Add whatsapp link to siteConfig or use placeholder
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="WhatsApp"
          >
            <WhatsappIcon className="h-5 w-5" />
          </Link>
          <Link
            href={siteConfig.links.instagram || "#"} // Add instagram link to siteConfig
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
             aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link
            href={siteConfig.links.x || siteConfig.links.twitter} // Add x link to siteConfig
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="X (formerly Twitter)"
          >
             {/* Using the custom XIcon */}
            <XIcon className="h-5 w-5" />
             {/* Or use the default Twitter icon if preferred: <Twitter className="h-5 w-5" /> */}
          </Link>
        </div>
      </div>
    </footer>
  )
}
