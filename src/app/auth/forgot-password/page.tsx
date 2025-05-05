// src/app/auth/forgot-password/page.tsx
"use client";

import React from 'react';
import Link from 'next/link'; // Import Link
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendPasswordReset } from '@/services/auth'; // Import the new auth service function
import type { AuthError } from 'firebase/auth';

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePasswordReset = async () => {
    setIsLoading(true);
    if (!email) {
      toast({
        title: "Missing Information",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordReset(email);
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for this email, you will receive instructions to reset your password.",
      });
      // Optionally redirect or clear the form
      // router.push('/auth/login');
      setEmail('');
    } catch (error) {
      const authError = error as AuthError;
      console.error("Password Reset Error:", authError.code, authError.message);
      // Avoid indicating whether the email exists for security reasons
      // Always show a generic success message, even if the email doesn't exist in Firebase
       toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for this email, you will receive instructions to reset your password.",
        // Use a less alarming variant for the generic message
        // variant: "destructive",
      });
      // Handle specific errors if needed (e.g., network error)
      if (authError.code === 'auth/network-request-failed') {
           toast({
            title: "Network Error",
            description: "Could not send reset email. Please check your connection.",
            variant: "destructive",
           });
       } else if (authError.code === 'auth/invalid-email') {
           // You might choose to show this error if the format is wrong
           toast({
            title: "Invalid Email Format",
            description: "Please enter a valid email address.",
            variant: "destructive",
           });
       } else if (authError.code === 'auth/unauthorized-domain') {
           console.error(
               "FIREBASE AUTH ERROR (Password Reset): Unauthorized Domain. \n" +
               "--> FIX: Ensure the domain (`" + (typeof window !== 'undefined' ? window.location.hostname : 'UNKNOWN_HOST') + "`) is added to your Firebase project's **Authentication > Settings > Authorized domains** list."
           );
           toast({
                title: "Configuration Error",
                description: "This domain is not authorized for password reset. Please contact support.",
                variant: "destructive",
            });
       }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-8 px-4">
      <h1 className="text-4xl font-bold text-primary mb-8">Forgot Password</h1>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>Enter your email address below and we'll send you instructions to reset your password.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button className="w-full" onClick={handlePasswordReset} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
