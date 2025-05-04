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
          Navigate campus effortlessly with TecoTransit, your reliable ride-booking app designed for safety and efficiency.
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
            data-ai-hint="campus transport electric vehicle"
          />
      </section>

      {/* How it Works Section */}
      <section className="w-full max-w-4xl mb-16">
        <h2 className="text-3xl font-semibold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="items-center">
              <Smartphone className="w-12 h-12 text-primary mb-2" />
              <CardTitle>1. Easy Booking</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Enter your pickup and drop-off locations, then select a date for your ride.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
               <MapPin className="w-12 h-12 text-primary mb-2" />
              <CardTitle>2. Smart Assignment</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Our system matches you with the nearest available vehicle for a swift pickup.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
               <CheckCircle className="w-12 h-12 text-primary mb-2" />
              <CardTitle>3. Enjoy the Ride</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Relax and enjoy a comfortable and safe ride to your destination on campus.
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
            <span><span className="font-semibold text-foreground">Safety First:</span> We prioritize your safety with trained drivers and monitored rides.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
            <span><span className="font-semibold text-foreground">Always On Time:</span> Get to your destination quickly and reliably.</span>
          </li>
           <li className="flex items-start">
            <MapPin className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
            <span><span className="font-semibold text-foreground">Wide Coverage:</span> Reach any point on campus with ease.</span>
          </li>
        </ul>
      </section>

       {/* Final CTA */}
      <section className="text-center mt-8">
         <p className="text-lg text-muted-foreground mb-4">Experience the convenience of TecoTransit today!</p>
        <Link href="/booking">
          <Button variant="secondary" size="lg">Book Your TecoTransit Ride</Button>
        </Link>
      </section>
    </div>
  );
}
