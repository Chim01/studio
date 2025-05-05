// src/components/site-header.tsx
"use client"; // Add this directive

import React, { useState, useEffect, useRef } from "react"; // Added useRef
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname
import { onAuthStateChanged, User, AuthError } from 'firebase/auth'; // Import User and AuthError type
import { auth } from '@/lib/firebase'; // Import auth instance
import { signOutUser, handleRedirectResult } from '@/services/auth'; // Import signOutUser & handleRedirectResult function
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { siteConfig } from "@/config/site";
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

import { ThemeToggle } from "@/components/theme-toggle";


interface SiteHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export function SiteHeader({ className, ...props }: SiteHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
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
      setAuthLoading(false); // Auth state known, set loading to false
    }, (error) => {
      // Handle potential errors during listener setup or execution
      console.error("Auth state listener error:", error);
      setUser(null); // Assume logged out on listener error
      setAuthLoading(false);
    });

    // Check for redirect result *only once* when the component mounts
    const checkRedirect = async () => {
       if (!auth || processingRedirect.current) {
            // If auth isn't ready yet, or redirect is already being processed, bail
            setRedirectLoading(false); // Set redirect loading false if auth isn't ready or already processing
            return;
        }
        processingRedirect.current = true; // Mark as processing

      console.log("Checking for Google Sign-In redirect result...");
      try {
        const userCredential = await handleRedirectResult();
        if (userCredential) {
          // User signed in successfully via redirect
          console.log("Redirect sign-in successful, user:", userCredential.user.displayName);
          toast({
            title: "Login Successful",
            description: `Welcome back, ${userCredential.user.displayName}!`,
          });
           // Auth listener should update the user state, but we can update it here too for faster UI
           setUser(userCredential.user);
           // Redirect to profile *only if* the user just logged in via redirect AND isn't already there
           if (pathname !== '/profile') {
                console.log("Redirecting to profile page...");
                router.push('/profile');
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
                "FIREBASE AUTH ERROR (Redirect Result): Invalid API Key. \n" +
                "Potential Causes & Solutions: \n" +
                "1. Check NEXT_PUBLIC_FIREBASE_API_KEY in your .env file. Is it correct (AIza...)? Is it the *web* API key? \n" +
                "2. Did you restart the Next.js server (npm run dev) after changing .env? \n" +
                "3. Check API Key restrictions in Google Cloud Console (Credentials > Your API Key): \n" +
                "   - Application restrictions > HTTP referrers: Ensure your app's URLs are listed (e.g., `localhost:9002/*`, `*.cloudworkstations.dev/*`, your deployment domain `/*`). \n" +
                "   - API restrictions: Ensure 'Identity Platform API' (or similar Firebase auth APIs) is enabled/unrestricted for this key. \n" +
                "4. Is the API key associated with the correct Firebase project (check Project ID in Firebase console vs. .env)? \n" +
                "5. Ensure Firebase Authentication > Settings > Authorized domains list includes your app's domains (e.g., `localhost`, `*.cloudworkstations.dev`, deployment domain). \n" +
                "6. Ensure the `firebaseConfig` in `src/lib/firebase.ts` is correctly loading the environment variable."
            );
            description = "Authentication configuration error. Please contact support or try again later."; // User-friendly message
        } else if (authError.message) {
            description = authError.message; // Use Firebase's message if available and not too technical
        }
        toast({
          title: "Google Sign-In Failed",
          description: description,
          variant: "destructive",
        });
        // Ensure user state is cleared if redirect login failed
        setUser(null);
      } finally {
         setRedirectLoading(false); // Redirect check finished
         processingRedirect.current = false; // Reset after processing attempt is complete
      }
    };

    // Call checkRedirect directly. It has an internal check for auth readiness.
    checkRedirect();

    // Cleanup: unsubscribe listener
    return () => {
      unsubscribe();
      // Reset processing flag on unmount just in case, although finally block should handle it
      processingRedirect.current = false;
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


  // Combined loading state
  const isLoading = authLoading || redirectLoading;

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)} {...props}>
       {/* Container centers content and adds horizontal padding */}
      <div className="container flex h-16 items-center justify-between px-4 md:px-6"> {/* Use justify-between and standard padding */}

        {/* Left Section: Mobile Nav Trigger and Desktop Nav */}
        <div className="flex items-center">
          {/* Mobile Nav Trigger (visible only on small screens) */}
          <div className="md:hidden mr-4"> {/* Display only on small screens, add margin right */}
              {/* Pass user and logout handler to MobileNav */}
              <MobileNav items={siteConfig.mainNav} user={user} onLogout={handleLogout} />
          </div>

          {/* Main Navigation & Logo Container (visible on md screens and up) */}
          <div className="hidden md:flex items-center"> {/* Removed flex-grow */}
             <MainNav items={siteConfig.mainNav} /> {/* MainNav includes the logo */}
          </div>
        </div>


        {/* Right Section: Authentication */}
        <div className="flex items-center space-x-3 md:space-x-4"> {/* Consistent spacing */}
          {isLoading ? (
             // Use Skeleton for better loading state
             <div className="flex items-center space-x-2">
                <Skeleton className="h-9 w-9 rounded-full" /> {/* Match Avatar size */}
                <Skeleton className="hidden md:block h-6 w-20 rounded-md" /> {/* Hide text skeleton on mobile */}
             </div>
          ) : user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-9 w-9 rounded-full"> {/* Consistent size */}
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
                 {/* Add Admin link conditionally if needed based on user role/ID */}
                  {/* {user.uid === 'YOUR_ADMIN_USER_ID' && (
                     <DropdownMenuItem asChild>
                       <Link href="/admin">Admin</Link>
                    </DropdownMenuItem>
                  )} */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Hide Login/Signup on small screens as they are in MobileNav sheet
            // Only show these buttons on medium screens and up
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/auth/login">
                 <Button variant="ghost" size="sm">Login</Button> {/* Use ghost for less emphasis */}
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
