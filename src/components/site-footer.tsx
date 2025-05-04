import React from "react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {}

export function SiteFooter({ className, ...props }: SiteFooterProps) {
  return (
    <footer className={cn("border-t bg-background", className)} {...props}>
      <div className="container flex flex-col items-center space-y-2 py-6 md:flex-row md:justify-between md:space-y-0">
        <span className="text-sm text-muted-foreground">
          {siteConfig.name} © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
