// src/app/auth/signup/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from '@/components/icons/google-icon';
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle } from '@/services/auth'; // Import the auth service
import type { AuthError } from 'firebase/auth'; // Import AuthError type
import { auth } from '@/lib/firebase'; // Import auth to check initialization


const SignupPage = () => {
   const { toast } = useToast();
   const router = useRouter(); // Initialize router

  const handleGoogleSignUp = async () => {
    // Check if Firebase Auth is initialized
    if (!auth) {
       toast({
        title: "Authentication Error",
        description: "Authentication service is not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }

     try {
      console.log('Attempting Google Sign-Up via redirect...');
      await signInWithGoogle(); // Use the same function for signup/login redirect
      // No userCredential or toast here, the result is handled after redirect in SiteHeader
      // Add a toast to inform the user they are being redirected.
       toast({
          title: "Redirecting to Google",
          description: "Please complete the sign-up with Google.",
        });
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
       // Add other specific error codes if needed

      toast({
        title: "Google Sign-Up Failed",
        description: description,
        variant: "destructive",
      });
    }
  };

   const handleEmailSignUp = () => {
    // TODO: Implement Firebase Email/Password Sign-Up logic
    console.log('Attempting Email Sign-Up...');
     toast({
      title: "Email Sign-Up",
      description: "Email sign-up functionality not yet implemented.",
      variant: "destructive",
    });
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
            <Input id="name" placeholder="Your name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your.email@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Create a password" />
          </div>
           <Button className="w-full" onClick={handleEmailSignUp}>Sign Up</Button>

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
          <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
             <GoogleIcon className="mr-2 h-4 w-4" /> {/* Added icon */}
            Sign up with Google
          </Button>

        </CardContent>
         {/* Optional Footer */}
        {/* <CardFooter>
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our Terms of Service.
          </p>
        </CardFooter> */}
      </Card>
    </div>
  );
};

export default SignupPage;
