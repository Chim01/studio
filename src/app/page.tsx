import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold text-primary mb-4">
        Welcome to Campus Cruiser
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center">
        Your reliable campus ride booking application. Book your ride now and travel with ease.
      </p>
      <Link href="/booking">
        <Button>Book a Ride</Button>
      </Link>
    </div>
  );
}
