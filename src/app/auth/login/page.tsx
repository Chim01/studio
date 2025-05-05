// src/app/auth/login/page.tsx
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
import { signInWithGoogle, signInWithEmail } from '@/services/auth'; // Import the auth service
import type { AuthError } from 'firebase/auth'; // Import AuthError type
import { auth } from '@/lib/firebase'; // Import auth to check initialization

const LoginPage = () => {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false); // Add loading state for Google button
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isEmailLoading, setIsEmailLoading] = React.useState(false);


  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true); // Set loading state immediately
    // Show toast immediately to indicate action is starting
    toast({
      title: "Redirecting to Google",
      description: "Please complete the sign-in with Google.",
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
      console.log('Attempting Google Sign-In via redirect...');
      await signInWithGoogle();
      // No userCredential or success toast here, the result is handled after redirect in SiteHeader
      // The user will be redirected to Google and then back to the app.
      // The "Redirecting" toast is already shown.
      // Don't reset loading state here, as the page will redirect away
    } catch (error) {
      // Catch errors during the *initiation* of the redirect only
      const authError = error as AuthError;
      console.error('Google Sign-In Initiation Failed:', authError);

      let description = "Could not start the Google Sign-In process. Please check your connection and try again.";
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
            description = "This domain is not authorized for Google Sign-In. Please contact support.";
       }
      // Add other specific error codes if needed

      toast({
        title: "Google Sign-In Failed",
        description: description,
        variant: "destructive",
      });
      setIsGoogleLoading(false); // Reset loading state on error
    }
  };

  const handleEmailLogin = async () => {
    setIsEmailLoading(true);
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      setIsEmailLoading(false);
      return;
    }

    try {
      await signInWithEmail(email, password);
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });
      router.push('/profile');
    } catch (error) {
      const authError = error as AuthError;
      let description = "Invalid credentials. Please check your email and password.";
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') { // Added invalid-credential
        description = "No user found or incorrect credentials.";
      } else if (authError.code === 'auth/wrong-password') {
        // This code might be less common now, `invalid-credential` is often used instead.
        description = "Incorrect password.";
      } else if (authError.code === 'auth/too-many-requests') {
          description = "Access temporarily disabled due to too many failed login attempts. Please reset your password or try again later.";
      } else if (authError.code === 'auth/network-request-failed') {
          description = "Network error. Please check your connection.";
      } else if (authError.code === 'auth/api-key-not-valid' || authError.message.includes('api-key-not-valid')) {
         console.error(
             "FIREBASE AUTH ERROR (Email Login): Invalid API Key. See console logs in site-header or auth.ts for debugging steps."
         );
         description = "Authentication configuration error. Please contact support.";
      } else if (authError.code === 'auth/unauthorized-domain') {
            console.error(
                 "FIREBASE AUTH ERROR (Email Login): Unauthorized Domain. \n" +
                 "--> FIX: Add the current domain (`" + window.location.hostname + "`) to your Firebase project's **Authentication > Settings > Authorized domains** list."
             );
            description = "This domain is not authorized for Email Sign-In. Please contact support.";
      }


      toast({
        title: "Login Failed",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsEmailLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-8 px-4"> {/* Adjusted min-height */}
      <h1 className="text-4xl font-bold text-primary mb-8">Login</h1>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to Your Account</CardTitle>
          <CardDescription>Enter your email and password or use Google.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your.email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {/* Forgot Password Link */}
            <div className="text-right mt-1">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          <Button className="w-full" onClick={handleEmailLogin} disabled={isEmailLoading}>
            {isEmailLoading ? 'Logging in...' : 'Login'}
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

          {/* Google Sign-In Button */}
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
            <GoogleIcon className="mr-2 h-4 w-4" /> {/* Added icon */}
            {isGoogleLoading ? 'Redirecting...' : 'Sign in with Google'}
          </Button>

        </CardContent>
        {/* Optional Footer */}
        {/* <CardFooter>
          <p className="text-xs text-muted-foreground">
            By logging in, you agree to our Terms of Service.
          </p>
        </CardFooter> */}
         <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
