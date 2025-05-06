// src/components/site-header.tsx
"use client"; // Add this directive

import React, { useState, useEffect, useRef } from "react"; // Added useRef
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname
import { onAuthStateChanged, User, AuthError, UserCredential } from 'firebase/auth'; // Import User, AuthError, UserCredential type
import { auth } from '@/lib/firebase'; // Import auth instance
import { signOutUser, handleRedirectResult } from '@/services/auth'; // Import signOutUser & handleRedirectResult function
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { siteConfig, MainNavItem } from "@/config/site"; // Import MainNavItem type
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Import Button for Logout
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Import Dropdown components
// Removed unsupported import: import { isNewUser } from 'firebase/auth';

import { ThemeToggle } from "@/components/theme-toggle";

// **SECURITY NOTE:** This is a placeholder for admin UIDs.
// In a real application, use Firebase Custom Claims or a database role system
// for secure and scalable role-based access control.
// Storing admin UIDs directly in the frontend code is NOT secure.
const ADMIN_UIDS_PLACEHOLDER = ['YOUR_ADMIN_USER_ID_1', 'YOUR_ADMIN_USER_ID_2']; // Replace with actual Admin UIDs for testing, but ideally use claims


interface SiteHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export function SiteHeader({ className, ...props }: SiteHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status
  // Separate loading states for initial auth check and redirect check
  const [authLoading, setAuthLoading] = useState(true);
  const [redirectLoading, setRedirectLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
  const { toast } = useToast();
  const processingRedirect = useRef(false); // Ref to prevent double processing

   // Get user's initials for Avatar Fallback
  const getUserInitials = (name: string | null | undefined): string => {
    if (!name) return 'U'; // Default to 'U' if name is not available
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  useEffect(() => {
    // Listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser?.displayName);
      setUser(currentUser);

      // **SECURITY:** Check admin status based on UID (Replace with claims later)
      const isAdminUser = currentUser ? ADMIN_UIDS_PLACEHOLDER.includes(currentUser.uid) : false;
      setIsAdmin(isAdminUser);
      console.log("User is admin:", isAdminUser);

      setAuthLoading(false); // Auth state known, set loading to false
    }, (error) => {
      // Handle potential errors during listener setup or execution
      console.error("Auth state listener error:", error);
      setUser(null); // Assume logged out on listener error
      setIsAdmin(false); // Reset admin status on error
      setAuthLoading(false);
    });

    // Check for redirect result *only once* when the component mounts
    const checkRedirect = async () => {
       if (!auth || processingRedirect.current) {
            setRedirectLoading(false);
            return;
        }
        processingRedirect.current = true;

      console.log("Checking for Google Sign-In redirect result...");
      try {
        const userCredential: UserCredential | null = await handleRedirectResult(); // Ensure type is correct
        if (userCredential) {
           const redirectedUser = userCredential.user;
           const isNew = userCredential.operationType === 'signUp'; // Use operationType to check if it's a signup

          console.log(`Redirect sign-in successful, user: ${redirectedUser.displayName}, Operation type: ${userCredential.operationType}, Is new user: ${isNew}`);
          toast({
            title: isNew ? "Signup Successful" : "Login Successful",
            description: `Welcome${isNew ? '' : ' back'}, ${redirectedUser.displayName}!`,
          });
           // Auth listener should update user state, but update here for faster UI response
           setUser(redirectedUser);
           // Update admin state based on redirect result user
           const isAdminUserRedirect = redirectedUser ? ADMIN_UIDS_PLACEHOLDER.includes(redirectedUser.uid) : false;
           setIsAdmin(isAdminUserRedirect);

           // Redirect logic:
           // 1. Admins go to /admin
           // 2. New users (signup) go to /profile for setup
           // 3. Existing users (login) go to /profile (or maybe /booking?)
           let targetPath = '/profile'; // Default for existing users and new users
           if (isAdminUserRedirect) {
               targetPath = '/admin';
           } else if (isNew) {
               targetPath = '/profile'; // Explicitly set for new users for clarity
           }
           // else { // Existing non-admin user
           //    targetPath = '/profile'; // or maybe '/booking'
           // }


           if (pathname !== targetPath) {
                console.log(`Redirecting to ${targetPath} page...`);
                router.push(targetPath);
           }
        } else {
             console.log("No redirect result found on this page load.");
        }
      } catch (error) {
        const authError = error as AuthError;
        console.error('Google Sign-In Redirect Processing Failed:', authError.code, authError.message);
        let description = "An error occurred during Google Sign-In.";
         if (authError.code === 'auth/account-exists-with-different-credential') {
           description = "An account already exists with the same email address but different sign-in credentials. Try signing in with the original method.";
         } else if (authError.code === 'auth/credential-already-in-use') {
             description = "This Google account is already linked to another user.";
         } else if (authError.code === 'auth/api-key-not-valid' || authError.message.includes('api-key-not-valid')) {
            console.error(
                "FIREBASE AUTH ERROR (Redirect Result): Invalid API Key. See logs in firebase.ts or auth.ts for debugging steps."
            );
            description = "Authentication configuration error. Please contact support or try again later."; // User-friendly message
        } else if (authError.code === 'auth/unauthorized-domain') {
             description = "This domain is not authorized for Google Sign-In. Please contact support.";
        } else if (authError.message) {
            description = authError.message;
        }
        toast({
          title: "Google Sign-In Failed",
          description: description,
          variant: "destructive",
        });
        // Ensure user state is cleared if redirect login failed
        setUser(null);
        setIsAdmin(false); // Reset admin status on error
      } finally {
         setRedirectLoading(false);
         processingRedirect.current = false;
      }
    };

    checkRedirect();

    return () => {
      unsubscribe();
      // No need to reset processingRedirect.current here as it's tied to component mount
    }
  }, [router, toast, pathname]); // Add pathname to dependencies


  const handleLogout = async () => {
    try {
      await signOutUser();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      setUser(null); // Immediately update UI state
      setIsAdmin(false); // Reset admin status on logout
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error("Logout failed:", error);
       const authError = error as AuthError;
      toast({
        title: "Logout Failed",
        description: authError.message || "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter main navigation items based on admin status
   const filteredMainNav = siteConfig.mainNav.filter(item => !item.adminOnly || isAdmin);


  // Combined loading state
  const isLoading = authLoading || redirectLoading;

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)} {...props}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">

        {/* Left Section: Mobile Nav Trigger and Desktop Nav */}
        <div className="flex items-center">
          {/* Mobile Nav Trigger (visible only on small screens) */}
          <div className="md:hidden mr-4">
              {/* Pass filtered items, user, and logout handler to MobileNav */}
              <MobileNav items={filteredMainNav} user={user} onLogout={handleLogout} isAdmin={isAdmin} />
          </div>

          {/* Main Navigation & Logo Container (visible on md screens and up) */}
          <div className="hidden md:flex items-center">
             <MainNav items={filteredMainNav} /> {/* Pass filtered items */}
          </div>
        </div>


        {/* Right Section: Authentication */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {isLoading ? (
             <div className="flex items-center space-x-2">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="hidden md:block h-6 w-20 rounded-md" />
             </div>
          ) : user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
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
                 {/* Add Admin link conditionally based on isAdmin state */}
                  {isAdmin && (
                     <DropdownMenuItem asChild>
                       <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/auth/login">
                 <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground">Login</Button>
              </Link>
              <Link href="/auth/signup">
                 <Button size="sm" variant="default">Sign Up</Button>
              </Link>
            </div>
          )}
          <ThemeToggle/>
        </div>
      </div>
    </header>
  );
}
