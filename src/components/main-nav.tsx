"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation" // Import usePathname
import { Bus } from "lucide-react"; // Import the Bus icon

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import type { MainNavItem } from "@/config/site" // Import type if needed


interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: MainNavItem[] // Use MainNavItem type
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname(); // Get current path

  return (
     // Removed outer div, SiteHeader will handle visibility and layout
    <>
      <Link href="/" className="mr-4 flex items-center space-x-2"> {/* Adjust margin right */}
         <Bus className="h-6 w-6 text-primary" /> {/* Use primary color */}
        <span className="font-bold text-lg text-foreground">TecoTransit</span> {/* Ensure text color matches theme */}
      </Link>

      {/* Conditionally render NavigationMenu only if items exist */}
      {items?.length ? (
        <NavigationMenu>
          <NavigationMenuList>
            {/* Main Navigation Items */}
            {items.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === item.href ? "bg-accent text-accent-foreground" : "", // Active state styling
                      "text-sm" // Ensure consistent text size
                    )}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      ) : null}
    </>
  )
}
