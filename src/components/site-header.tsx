import React from "react"

import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import Link from "next/link";

interface SiteHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export function SiteHeader({ className, ...props }: SiteHeaderProps) {
  return (
    <header className={cn("bg-background", className)} {...props}>
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <MobileNav items={siteConfig.mainNav} />
        <div className="flex flex-row gap-4">
            <Link href="/profile" className="text-sm font-medium hover:underline">
              Profile
            </Link>
             <Link href="/auth/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
            <Link href="/auth/signup" className="text-sm font-medium hover:underline">
              Sign Up
            </Link>
        </div>
      </div>
    </header>
  )
}
