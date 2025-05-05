// src/components/mobile-nav.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { User } from "firebase/auth"; // Import User type

import { siteConfig, MainNavItem } from "@/config/site" // Import MainNavItem type
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
  items: MainNavItem[], // Expect filtered items
  user?: User | null;
  onLogout?: () => Promise<void>;
  isAdmin?: boolean; // Add isAdmin prop
}

export function MobileNav({ items, user, onLogout, isAdmin }: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  // Close sheet on navigation
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogoutClick = async () => {
    setOpen(false); // Close sheet first
    if (onLogout) {
      await onLogout();
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex h-9 w-9 items-center justify-center p-0 md:hidden"
          aria-label="Open menu"
        >
          <Icons.menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 w-[280px]">
        <SheetHeader className="text-left px-4 pt-4">
           <Link href="/" className="flex items-center space-x-2 mb-4" onClick={() => setOpen(false)}>
             <Icons.logo className="h-6 w-6 text-primary" />
             <SheetTitle className="font-bold text-lg text-primary">{siteConfig.name}</SheetTitle>
           </Link>
          {/* <SheetDescription>
            {siteConfig.description}
          </SheetDescription> */}
        </SheetHeader>
        <nav className="mt-6 grid gap-2 px-4">
          {/* Display filtered main nav items */}
          {items?.length ? (
              items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                    item.disabled && "pointer-events-none opacity-60" // Handle disabled state
                  )}
                  aria-disabled={item.disabled}
                >
                  {item.title}
                </Link>
              ))
          ) : null}

           <hr className="my-2 border-border"/>

           {/* Show Profile/Logout/Admin if user is logged in */}
           {user ? (
             <>
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
                {/* Conditionally show Admin link */}
                 {isAdmin && (
                     <Link
                         href="/admin"
                         onClick={() => setOpen(false)}
                         className={cn(
                         "flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                         pathname === "/admin" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                         )}
                     >
                         Admin Dashboard
                    </Link>
                 )}
                <Button
                    variant="ghost"
                    className="justify-start px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground w-full" // Ensure full width for consistency
                    onClick={handleLogoutClick}
                >
                 Logout
                </Button>
             </>
           ) : (
             // Show Login/Signup if not logged in
             <>
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
           )}

        </nav>
      </SheetContent>
    </Sheet>
  )
}