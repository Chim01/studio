import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MapPin, Smartphone, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-12 px-4 md:px-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Welcome to TecoTransit
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your reliable campus ride booking application. Get where you need to go, safely and efficiently.
        </p>
        <Link href="/booking">
          <Button size="lg">Book a Ride Now</Button>
        </Link>
      </section>

      {/* Placeholder Image */}
      <section className="mb-16 w-full max-w-4xl">
         <Image
            src="https://picsum.photos/1024/400"
            alt="Campus transportation illustration"
            width={1024}
            height={400}
            className="rounded-lg shadow-md object-cover w-full"
            data-ai-hint="campus transport shuttle"
          />
      </section>

      {/* How it Works Section */}
      <section className="w-full max-w-4xl mb-16">
        <h2 className="text-3xl font-semibold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="items-center">
              <Smartphone className="w-12 h-12 text-primary mb-2" />
              <CardTitle>1. Book Your Ride</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Enter your origin, destination, and desired date using our simple booking form.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
               <MapPin className="w-12 h-12 text-primary mb-2" />
              <CardTitle>2. Get Assigned</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Our system assigns you to an available vehicle and notifies you of the details.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
               <CheckCircle className="w-12 h-12 text-primary mb-2" />
              <CardTitle>3. Travel Easily</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Meet your ride at the designated spot and enjoy a comfortable journey across campus.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full max-w-4xl mb-12">
        <h2 className="text-3xl font-semibold text-center mb-8">Why Choose TecoTransit?</h2>
        <ul className="space-y-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          <li className="flex items-start">
            <ShieldCheck className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
            <span><span className="font-semibold text-foreground">Safe & Reliable:</span> Trained drivers and well-maintained vehicles ensure your safety.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
            <span><span className="font-semibold text-foreground">Convenient Booking:</span> Easy-to-use web app for quick ride requests.</span>
          </li>
           <li className="flex items-start">
            <MapPin className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
            <span><span className="font-semibold text-foreground">Campus-Wide Coverage:</span> We cover all major points across the campus.</span>
          </li>
        </ul>
      </section>

       {/* Final CTA */}
      <section className="text-center mt-8">
         <p className="text-lg text-muted-foreground mb-4">Ready to ride?</p>
        <Link href="/booking">
          <Button variant="secondary" size="lg">Book Your TecoTransit Ride</Button>
        </Link>
      </section>
    </div>
  );
}
