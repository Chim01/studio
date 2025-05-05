import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MapPin, Smartphone, ShieldCheck, Zap, Leaf, Bus } from "lucide-react"; // Added Bus icon

export default async function Home() {

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

      {/* Creative Text Section */}
      <section className="mb-16 w-full max-w-4xl text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-12 px-6 rounded-lg shadow-md">
        <Zap className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
        <h2 className="text-3xl font-semibold mb-4">Your Campus, Reimagined.</h2>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Back on campus? Let TecoTransit welcome you home. Forget the long treks and missed moments. Relax, unwind, and let us handle the ride. Your campus adventure starts here, effortlessly.
        </p>
         <p className="text-md text-muted-foreground max-w-xl mx-auto mt-2 italic">
          Get where you need to be, hassle-free.
        </p>
      </section>


      {/* How it Works Section */}
      <section className="w-full max-w-4xl mb-16">
        <h2 className="text-3xl font-semibold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="items-center">
              <Smartphone className="w-12 h-12 text-primary mb-2" />
              <CardTitle>1. Easy Booking</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Enter your pickup and drop-off locations, then select a date for your ride via our simple app.
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="items-center">
               <MapPin className="w-12 h-12 text-primary mb-2" />
              <CardTitle>2. Smart Assignment</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Our system matches you with the nearest available vehicle for a swift pickup. Track your ride in real-time.
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="items-center">
               <CheckCircle className="w-12 h-12 text-primary mb-2" />
              <CardTitle>3. Enjoy the Ride</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Relax and enjoy a comfortable and safe ride to your destination on campus with our professional drivers.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full max-w-5xl mb-12"> {/* Increased max-w for grid */}
        <h2 className="text-3xl font-semibold text-center mb-8 text-secondary-foreground">Why Choose TecoTransit?</h2>
        {/* Changed ul to div and applied grid classes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-lg text-muted-foreground max-w-5xl mx-auto px-4">
          {/* Each item is now a Card */}
          <Card className="bg-secondary flex flex-col items-center p-6 text-center">
            <ShieldCheck className="w-12 h-12 text-primary mb-4 flex-shrink-0" />
            <h3 className="font-semibold text-foreground mb-2 text-xl">Safety First</h3>
            <p className="text-sm">We prioritize your safety with trained drivers, well-maintained vehicles, and monitored rides.</p>
          </Card>
          <Card className="bg-secondary flex flex-col items-center p-6 text-center">
            <CheckCircle className="w-12 h-12 text-primary mb-4 flex-shrink-0" />
            <h3 className="font-semibold text-foreground mb-2 text-xl">Always On Time</h3>
            <p className="text-sm">Our efficient routing and scheduling means you get to your destination reliably and quickly.</p>
          </Card>
           <Card className="bg-secondary flex flex-col items-center p-6 text-center">
            <MapPin className="w-12 h-12 text-primary mb-4 flex-shrink-0" />
            <h3 className="font-semibold text-foreground mb-2 text-xl">Campus-Wide</h3>
            <p className="text-sm">Reach any point on campus with ease, from dorms to lecture halls and facilities.</p>
          </Card>
           <Card className="bg-secondary flex flex-col items-center p-6 text-center">
            <Leaf className="w-12 h-12 text-primary mb-4 flex-shrink-0"/>
            <h3 className="font-semibold text-foreground mb-2 text-xl">Eco-Friendly</h3>
            <p className="text-sm">Choose our electric vehicles for a greener way to travel around campus.</p>
          </Card>
        </div>
      </section>

       {/* Testimonials Section (Example) */}
      <section className="w-full max-w-4xl mb-16">
        <h2 className="text-3xl font-semibold text-center mb-8">What Our Riders Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground italic">"TecoTransit is a lifesaver! Getting across campus between classes used to be stressful, but now it's quick and easy."</p>
              <p className="text-right font-semibold mt-4">- Alex J.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground italic">"The drivers are always friendly, and the app is super simple to use. Highly recommend it for any student."</p>
              <p className="text-right font-semibold mt-4">- Sarah M.</p>
            </CardContent>
          </Card>
        </div>
      </section>


       {/* Final CTA */}
      <section className="text-center mt-8">
         <p className="text-lg text-muted-foreground mb-4">Ready to simplify your campus commute? Experience the convenience of TecoTransit today!</p>
        <Link href="/booking">
          <Button variant="default" size="lg">Book Your Ride</Button>
        </Link>
      </section>
    </div>
  );
}
