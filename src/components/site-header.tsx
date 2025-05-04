// src/components/site-header.tsx
"use client"; // Add this directive

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Import useRouter
import { onAuthStateChanged, User } from 'firebase/auth'; // Import User type
import { auth } from '@/lib/firebase'; // Import auth instance
import { signOutUser } from '@/services/auth'; // Import signOutUser function
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Import Button for Logout
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Import Dropdown components


interface SiteHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export function SiteHeader({ className, ...props }: SiteHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

   // Get user's initials for Avatar Fallback
  const getUserInitials = (name: string | null | undefined): string => {
    if (!name) return 'U'; // Default to 'U' if name is not available
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)} {...props}>
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 pl-4 md:pl-8"> {/* Added padding left */}
        <MainNav items={siteConfig.mainNav} />
        <MobileNav items={siteConfig.mainNav} />
        <div className="flex items-center gap-4 ml-auto"> {/* Use ml-auto to push to the right */}
          {loading ? (
             <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div> // Simple loader
          ) : user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                    <AvatarFallback>{getUserInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                 </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                   <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                   <Link href="/booking">Booking</Link>
                </DropdownMenuItem>
                 {/* Add other relevant links */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Login
              </Link>
              <Link href="/auth/signup">
                 <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
