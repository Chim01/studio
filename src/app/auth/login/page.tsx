// src/app/auth/login/page.tsx
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

const LoginPage = () => {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router

  const handleGoogleSignIn = async () => {
    try {
      console.log('Attempting Google Sign-In via redirect...');
      await signInWithGoogle();
      // No userCredential or toast here, the result is handled after redirect in SiteHeader
      // The user will be redirected to Google and then back to the app.
    } catch (error) {
      // Catch errors during the *initiation* of the redirect only
      const authError = error as AuthError;
      console.error('Google Sign-In Initiation Failed:', authError);
      toast({
        title: "Google Sign-In Failed",
        description: "Could not start the Google Sign-In process. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  const handleEmailLogin = () => {
    // TODO: Implement Firebase Email/Password Login logic
    console.log('Attempting Email Login...');
    toast({
      title: "Email Login",
      description: "Email login functionality not yet implemented.",
      variant: "destructive",
    });
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
            <Input id="email" type="email" placeholder="your.email@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Your password" />
          </div>
           <Button className="w-full" onClick={handleEmailLogin}>Login</Button>

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
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
             <GoogleIcon className="mr-2 h-4 w-4" /> {/* Added icon */}
            Sign in with Google
          </Button>

        </CardContent>
        {/* Optional Footer */}
        {/* <CardFooter>
          <p className="text-xs text-muted-foreground">
            By logging in, you agree to our Terms of Service.
          </p>
        </CardFooter> */}
      </Card>
    </div>
  );
};

export default LoginPage;
