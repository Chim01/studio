"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";

const BookingPage = () => {
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [date, setDate] = React.useState<Date | undefined>(undefined);
    const { toast } = useToast()

  const handleBooking = () => {
    if (!origin || !destination || !date) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields.",
      })
      return;
    }

    // TODO: Implement booking logic
     toast({
        title: "Booking Submitted",
        description: `Ride from ${origin} to ${destination} on ${date?.toLocaleDateString()} requested.`,
      })
    console.log('Booking details:', { origin, destination, date });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 px-4">
      <h1 className="text-4xl font-bold text-primary mb-8">Book Your Ride</h1>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Ride Details</CardTitle>
          <CardDescription>Enter your origin, destination, and desired travel date.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="origin">Origin</Label>
            <Input id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date?.toLocaleDateString() : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Time of Departure is set by admin
          <div className="grid gap-2">
            <Label htmlFor="time">Time of Departure</Label>
            <Input type="time" id="time" />
          </div> */}
        </CardContent>
        <Button className="w-full mt-4" onClick={handleBooking}>Book Ride</Button>
      </Card>
    </div>
  );
};

export default BookingPage;
