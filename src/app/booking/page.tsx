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

const nigerianLocations = [
  "Abia State", "Umuahia, Abia State", "Abia State University",
  "Adamawa State", "Yola, Adamawa State", "American University of Nigeria",
  "Akwa Ibom State", "Uyo, Akwa Ibom State", "University of Uyo",
  "Anambra State", "Awka, Anambra State", "Nnamdi Azikiwe University",
  "Bauchi State", "Bauchi, Bauchi State", "Abubakar Tafawa Balewa University",
  "Bayelsa State", "Yenagoa, Bayelsa State", "Niger Delta University",
  "Benue State", "Makurdi, Benue State", "Benue State University",
  "Borno State", "Maiduguri, Borno State", "University of Maiduguri",
  "Cross River State", "Calabar, Cross River State", "University of Calabar",
  "Delta State", "Asaba, Delta State", "Delta State University",
  "Ebonyi State", "Abakaliki, Ebonyi State", "Ebonyi State University",
  "Edo State", "Benin City, Edo State", "University of Benin",
  "Ekiti State", "Ado Ekiti, Ekiti State", "Ekiti State University",
  "Enugu State", "Enugu, Enugu State", "University of Nigeria, Enugu Campus",
  "Gombe State", "Gombe, Gombe State", "Gombe State University",
  "Imo State", "Owerri, Imo State", "Federal University of Technology Owerri",
  "Jigawa State", "Dutse, Jigawa State", "Federal University Dutse",
  "Kaduna State", "Kaduna, Kaduna State", "Ahmadu Bello University",
  "Kano State", "Kano, Kano State", "Bayero University Kano",
  "Katsina State", "Katsina, Katsina State", "Federal University Katsina",
  "Kebbi State", "Birnin Kebbi, Kebbi State", "Federal University Birnin Kebbi",
  "Kogi State", "Lokoja, Kogi State", "Kogi State University",
  "Kwara State", "Ilorin, Kwara State", "University of Ilorin",
  "Lagos State", "Ikeja, Lagos State", "University of Lagos",
  "Nasarawa State", "Lafia, Nasarawa State", "Nasarawa State University",
  "Niger State", "Minna, Niger State", "Federal University of Technology Minna",
  "Ogun State", "Abeokuta, Ogun State", "Federal University of Agriculture Abeokuta",
  "Ondo State", "Akure, Ondo State", "Federal University of Technology Akure",
  "Osun State", "Osogbo, Osun State", "Obafemi Awolowo University",
  "Oyo State", "Ibadan, Oyo State", "University of Ibadan",
  "Plateau State", "Jos, Plateau State", "University of Jos",
  "Rivers State", "Port Harcourt, Rivers State", "University of Port Harcourt",
  "Sokoto State", "Sokoto, Sokoto State", "Usmanu Danfodiyo University",
  "Taraba State", "Jalingo, Taraba State", "Taraba State University",
  "Yobe State", "Damaturu, Yobe State", "Yobe State University",
  "Zamfara State", "Gusau, Zamfara State", "Federal University Gusau",
  "Abuja, Federal Capital Territory",
  "Lagos", "Ibadan", "Kano", "Port Harcourt", "Benin City",
  "Onitsha", "Aba", "Warri", "Kaduna", "Enugu",
];

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
            <Input id="origin" list="origin-list" value={origin} onChange={(e) => setOrigin(e.target.value)} />
            <datalist id="origin-list">
              {nigerianLocations.map((location, index) => (
                <option key={`${location}-${index}`} value={location} />
              ))}
            </datalist>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" list="destination-list" value={destination} onChange={(e) => setDestination(e.target.value)} />
            <datalist id="destination-list">
              {nigerianLocations.map((location, index) => (
                <option key={`${location}-${index}`} value={location} />
              ))}
            </datalist>
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
