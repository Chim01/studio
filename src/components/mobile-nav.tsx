// src/components/mobile-nav.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from "firebase/auth"; // Import User type if needed (or use from SiteHeader context)

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface MobileNavProps {
  items: {
    title: string
    href: string
    disabled?: boolean
  }[],
  // Optional: Pass user state if needed for conditional rendering
  // user?: User | null;
}

export function MobileNav({ items /*, user */ }: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  // Close sheet on navigation
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon" // Use standard icon size
          className="flex h-9 w-9 items-center justify-center p-0 md:hidden" // Removed mr-2, ensure padding is 0 for icon size
          aria-label="Open menu"
        >
          <Icons.menu className="h-5 w-5" /> {/* Adjusted icon size */}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 w-[280px]"> {/* Optional: Adjust width */}
        <SheetHeader className="text-left px-4 pt-4"> {/* Added padding */}
           <Link href="/" className="flex items-center space-x-2 mb-4" onClick={() => setOpen(false)}>
            {/* Reuse logo/name from MainNav */}
             <Icons.logo className="h-6 w-6 text-primary" />
             <SheetTitle className="font-bold text-lg text-primary">{siteConfig.name}</SheetTitle> {/* Changed text color to primary */}
           </Link>
          {/* <SheetDescription>
            {siteConfig.description}
          </SheetDescription> */}
        </SheetHeader>
        <nav className="mt-6 grid gap-2 px-4"> {/* Use nav tag */}
          {items?.length ? (
              items.map((item) => (
                <Link
                  key={item.href} // Use href as key if guaranteed unique
                  href={item.href}
                  onClick={() => setOpen(false)} // Close sheet on link click
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground", // Adjusted text size and padding
                    pathname === item.href
                      ? "bg-accent text-accent-foreground" // Active state
                      : "text-muted-foreground"
                  )}
                  aria-disabled={item.disabled}
                >
                  {item.title}
                </Link>
              ))
          ) : null}

           {/* Add links that are normally in the user dropdown or login/signup */}
           {/* Example: Link to profile (conditionally show if logged in) */}
           {/* {user && (
              <Link
                href="/profile"
                 onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === "/profile" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                Profile
              </Link>
           )} */}

           {/* Example: Show Login/Signup if not logged in */}
           {/* {!user && ( */}
             <>
               <hr className="my-2 border-border"/> {/* Separator */}
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === "/auth/login" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setOpen(false)}
                   className={cn(
                    "flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === "/auth/signup" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  Sign Up
                </Link>
             </>
           {/* )} */}

        </nav>
      </SheetContent>
    </Sheet>
  )
}

// Add Icons.logo if it doesn't exist in icons.tsx
// Example:
// import { Bus } from "lucide-react";
// export const Icons = {
//   menu: MenuIcon,
//   logo: Bus, // Or your specific logo component
// }
