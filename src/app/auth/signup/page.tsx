// src/app/auth/signup/page.tsx
"use client";

import React from 'react';
import Link from 'next/link'; // Import Link
import { useRouter } from 'next/navigation'; // Import useRouter
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from '@/components/icons/google-icon';
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, signUpWithEmail } from '@/services/auth'; // Import the auth service
import type { AuthError } from 'firebase/auth'; // Import AuthError type
import { auth } from '@/lib/firebase'; // Import auth to check initialization


const SignupPage = () => {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false); // Add loading state for Google button
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isEmailLoading, setIsEmailLoading] = React.useState(false);


  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true); // Set loading state immediately
    // Show toast immediately to indicate action is starting
    toast({
      title: "Redirecting to Google",
      description: "Please complete the sign-up with Google.",
    });

    // Check if Firebase Auth is initialized
    if (!auth) {
      toast({
        title: "Authentication Error",
        description: "Authentication service is not available. Please try again later.",
        variant: "destructive",
      });
      setIsGoogleLoading(false); // Reset loading state on error
      return;
    }

    try {
      console.log('Attempting Google Sign-Up via redirect...');
      await signInWithGoogle(); // Use the same function for signup/login redirect
      // No userCredential or success toast here, the result is handled after redirect in SiteHeader
      // The "Redirecting" toast is already shown.
      // Don't reset loading state here, as the page will redirect away
    } catch (error) {
      // Catch errors during the *initiation* of the redirect only
      const authError = error as AuthError;
      console.error('Google Sign-Up Initiation Failed:', authError);

      let description = "Could not start the Google Sign-Up process. Please check your connection and try again.";
      // Provide more specific feedback if possible
      if (authError.code === 'auth/network-request-failed') {
        description = "Network error. Please check your internet connection.";
      } else if (error instanceof Error && error.message === "Authentication service not ready.") {
        description = "Authentication service is not available. Please try again later.";
      }
       else if (authError.code === 'auth/api-key-not-valid' || authError.message.includes('api-key-not-valid')) {
            console.error(
                "FIREBASE AUTH ERROR: Invalid API Key. \n" +
                "Potential Causes & Solutions: \n" +
                "1. Check NEXT_PUBLIC_FIREBASE_API_KEY in your .env file. Is it correct? Is it the *web* API key? \n" +
                "2. Did you restart the Next.js server (npm run dev) after changing .env? \n" +
                "3. Check API Key restrictions in Google Cloud Console (Credentials > Your API Key): \n" +
                "   - Application restrictions > HTTP referrers: Ensure your app's URLs are listed (e.g., `localhost:9002/*`, `*.cloudworkstations.dev/*`, your deployment domain `/*`). \n" +
                "   - API restrictions: Ensure 'Identity Platform API' (or similar Firebase auth APIs) is enabled/unrestricted for this key. \n" +
                "4. Is the API key associated with the correct Firebase project (check Project ID in Firebase console vs. .env)? \n" +
                "5. Ensure Firebase Authentication > Settings > Authorized domains list includes your app's domains (e.g., `localhost`, `*.cloudworkstations.dev`, deployment domain). \n" +
                "6. Ensure the `firebaseConfig` in `src/lib/firebase.ts` is correctly loading the environment variable."
            );
            description = "Authentication configuration error. Please contact support or try again later."; // User-friendly message
      }
       else if (authError.code === 'auth/unauthorized-domain') {
             console.error(
                 "FIREBASE AUTH ERROR: Unauthorized Domain. \n" +
                 "--> FIX: Add the current domain (`" + window.location.hostname + "`) to your Firebase project's **Authentication > Settings > Authorized domains** list. See comments in `src/lib/firebase.ts` for details."
             );
            description = "This domain is not authorized for Google Sign-Up. Please contact support.";
       }
      // Add other specific error codes if needed

      toast({
        title: "Google Sign-Up Failed",
        description: description,
        variant: "destructive",
      });
      setIsGoogleLoading(false); // Reset loading state on error
    }
  };

  const handleEmailSignUp = async () => {
    setIsEmailLoading(true);
    if (!name || !email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter your name, email, and password.",
        variant: "destructive",
      });
      setIsEmailLoading(false);
      return;
    }

    try {
      await signUpWithEmail(email, password, name);
      toast({
        title: "Sign-Up Successful",
        description: "Your account has been created. Please log in.",
      });
      router.push('/auth/login');
    } catch (error) {
      const authError = error as AuthError;
      let description = "Could not create an account. Please try again.";
      if (authError.code === 'auth/email-already-in-use') {
        description = "An account with this email already exists.";
      } else if (authError.code === 'auth/invalid-email') {
        description = "Invalid email address.";
      } else if (authError.code === 'auth/weak-password') {
        description = "Weak password. Please use a stronger password.";
      } else if (authError.code === 'auth/network-request-failed') {
          description = "Network error. Please check your connection.";
      } else if (authError.code === 'auth/api-key-not-valid' || authError.message.includes('api-key-not-valid')) {
         console.error(
             "FIREBASE AUTH ERROR (Signup): Invalid API Key. See console logs in site-header or auth.ts for debugging steps."
         );
         description = "Authentication configuration error. Please contact support.";
      } else if (authError.code === 'auth/unauthorized-domain') {
            console.error(
                 "FIREBASE AUTH ERROR (Signup): Unauthorized Domain. \n" +
                 "--> FIX: Add the current domain (`" + window.location.hostname + "`) to your Firebase project's **Authentication > Settings > Authorized domains** list."
             );
            description = "This domain is not authorized for Email Sign-Up. Please contact support.";
      }


      toast({
        title: "Sign-Up Failed",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsEmailLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-8 px-4"> {/* Adjusted min-height */}
      <h1 className="text-4xl font-bold text-primary mb-8">Sign Up</h1>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create a New Account</CardTitle>
          <CardDescription>Enter your details or use Google.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your.email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleEmailSignUp} disabled={isEmailLoading}>
            {isEmailLoading ? 'Signing up...' : 'Sign Up'}
          </Button>

          {/* Separator */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign-Up Button */}
          <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={isGoogleLoading}>
            <GoogleIcon className="mr-2 h-4 w-4" /> {/* Added icon */}
            {isGoogleLoading ? 'Redirecting...' : 'Sign up with Google'}
          </Button>

        </CardContent>
        {/* Optional Footer */}
        <CardFooter className="flex justify-center">
           <p className="text-sm text-muted-foreground">
             Already have an account?{" "}
             <Link href="/auth/login" className="text-primary hover:underline">
               Login
             </Link>
           </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
