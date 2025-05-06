// src/app/auth/login/page.tsx
"use client";

import React, { useState } from 'react'; // Import useState
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react'; // Import Eye icons
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from '@/components/icons/google-icon';
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, signInWithEmail } from '@/services/auth';
import type { AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const LoginPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    toast({
      title: "Redirecting to Google",
      description: "Please complete the sign-in with Google.",
    });

    if (!auth) {
      toast({
        title: "Authentication Error",
        description: "Authentication service is not available. Please try again later.",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
      return;
    }

    try {
      console.log('Attempting Google Sign-In via redirect...');
      await signInWithGoogle();
    } catch (error) {
      const authError = error as AuthError;
      console.error('Google Sign-In Initiation Failed:', authError);

      let description = "Could not start the Google Sign-In process. Please check your connection and try again.";
      if (authError.code === 'auth/network-request-failed') {
        description = "Network error. Please check your internet connection.";
      } else if (error instanceof Error && error.message === "Authentication service not ready.") {
        description = "Authentication service is not available. Please try again later.";
      } else if (authError.code === 'auth/api-key-not-valid' || authError.message.includes('api-key-not-valid')) {
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
        description = "Authentication configuration error. Please contact support or try again later.";
      } else if (authError.code === 'auth/unauthorized-domain') {
        console.error(
          "FIREBASE AUTH ERROR: Unauthorized Domain. \n" +
          "--> FIX: Add the current domain (`" + (typeof window !== 'undefined' ? window.location.hostname : 'UNKNOWN_HOST') + "`) to your Firebase project's **Authentication > Settings > Authorized domains** list. See comments in `src/lib/firebase.ts` for details."
        );
        description = "This domain is not authorized for Google Sign-In. Please contact support.";
      }

      toast({
        title: "Google Sign-In Failed",
        description: description,
        variant: "destructive",
      });
      setIsGoogleLoading(false);
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
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
        description = "No user found or incorrect credentials.";
      } else if (authError.code === 'auth/wrong-password') {
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
          "--> FIX: Add the current domain (`" + (typeof window !== 'undefined' ? window.location.hostname : 'UNKNOWN_HOST') + "`) to your Firebase project's **Authentication > Settings > Authorized domains** list."
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-8 px-4">
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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"} // Toggle input type
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10" // Add padding for the icon button
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
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

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
            <GoogleIcon className="mr-2 h-4 w-4" />
            {isGoogleLoading ? 'Redirecting...' : 'Sign in with Google'}
          </Button>
        </CardContent>
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
