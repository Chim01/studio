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
import { format } from "date-fns"; // Import format function

// Combined list of Nigerian locations (States, Capitals, Cities, Universities)
// Note: This list is extensive but not exhaustive. Consider using a searchable dropdown/API for a better UX in a real app.
const nigerianLocations = [
  // States & Capitals
  "Abia State", "Umuahia, Abia State",
  "Adamawa State", "Yola, Adamawa State",
  "Akwa Ibom State", "Uyo, Akwa Ibom State",
  "Anambra State", "Awka, Anambra State",
  "Bauchi State", "Bauchi, Bauchi State",
  "Bayelsa State", "Yenagoa, Bayelsa State",
  "Benue State", "Makurdi, Benue State",
  "Borno State", "Maiduguri, Borno State",
  "Cross River State", "Calabar, Cross River State",
  "Delta State", "Asaba, Delta State",
  "Ebonyi State", "Abakaliki, Ebonyi State",
  "Edo State", "Benin City, Edo State",
  "Ekiti State", "Ado Ekiti, Ekiti State",
  "Enugu State", "Enugu, Enugu State",
  "Gombe State", "Gombe, Gombe State",
  "Imo State", "Owerri, Imo State",
  "Jigawa State", "Dutse, Jigawa State",
  "Kaduna State", "Kaduna, Kaduna State",
  "Kano State", "Kano, Kano State",
  "Katsina State", "Katsina, Katsina State",
  "Kebbi State", "Birnin Kebbi, Kebbi State",
  "Kogi State", "Lokoja, Kogi State",
  "Kwara State", "Ilorin, Kwara State",
  "Lagos State", "Ikeja, Lagos State",
  "Nasarawa State", "Lafia, Nasarawa State",
  "Niger State", "Minna, Niger State",
  "Ogun State", "Abeokuta, Ogun State",
  "Ondo State", "Akure, Ondo State",
  "Osun State", "Osogbo, Osun State",
  "Oyo State", "Ibadan, Oyo State",
  "Plateau State", "Jos, Plateau State",
  "Rivers State", "Port Harcourt, Rivers State",
  "Sokoto State", "Sokoto, Sokoto State",
  "Taraba State", "Jalingo, Taraba State",
  "Yobe State", "Damaturu, Yobe State",
  "Zamfara State", "Gusau, Zamfara State",
  "Abuja, Federal Capital Territory",

  // Major Cities
  "Lagos", "Ibadan", "Kano", "Port Harcourt", "Benin City",
  "Onitsha", "Aba", "Warri", "Kaduna", "Enugu", "Abeokuta",
  "Jos", "Ilorin", "Owerri", "Maiduguri", "Zaria", "Akure",
  "Calabar", "Uyo", "Sokoto",

  // Universities (Sample) - Add more as needed
  "Abia State University",
  "Abubakar Tafawa Balewa University",
  "Achievers University, Owo",
  "Adamawa State University",
  "Adekunle Ajasin University",
  "Adeleke University",
  "Afe Babalola University",
  "African University of Science and Technology",
  "Ahmadu Bello University",
  "Ajayi Crowther University",
  "Akwa Ibom State University",
  "Al-Hikmah University",
  "Al-Qalam University, Katsina",
  "Ambrose Alli University",
  "American University of Nigeria",
  "Anambra State University",
  "Augustine University",
  "Babcock University",
  "Bauchi State University",
  "Bayero University Kano",
  "Baze University",
  "Bells University of Technology",
  "Benson Idahosa University",
  "Benue State University",
  "Bingham University",
  "Bowen University",
  "Caleb University",
  "Caritas University",
  "Chrisland University",
  "Christopher University",
  "Chukwuemeka Odumegwu Ojukwu University",
  "Clifford University",
  "Coal City University",
  "Convenant University Ota",
  "Crawford University",
  "Crescent University",
  "Cross River University of Technology",
  "Crown Hill University",
  "Delta State University",
  "Dominican University Ibadan",
  "Eastern Palm University Ogboko",
  "Ebonyi State University",
  "Edo University",
  "Edwin Clark University",
  "Ekiti State University",
  "Eko University of Medicine and Health Sciences",
  "Elizade University",
  "Evangel University, Akaeze",
  "Federal University Gashua",
  "Federal University Gusau",
  "Federal University of Agriculture Abeokuta",
  "Federal University of Petroleum Resources Effurun",
  "Federal University of Technology Akure",
  "Federal University of Technology Minna",
  "Federal University of Technology Owerri",
  "Federal University Dutse",
  "Federal University Dutsin-Ma",
  "Federal University Kashere",
  "Federal University Lafia",
  "Federal University Lokoja",
  "Federal University Ndufu-Alike",
  "Federal University Otuoke",
  "Federal University Oye-Ekiti",
  "Federal University Wukari",
  "Fountain Unveristy",
  "Godfrey Okoye University",
  "Gombe State University",
  "Gregory University, Uturu",
  "Hallmark University, Ijebu-Itele",
  "Hezekiah University",
  "Ibrahim Badamasi Babangida University",
  "Igbinedion University Okada",
  "Imo State University",
  "Joseph Ayo Babalola University",
  "Kaduna State University",
  "Kano University of Science & Technology",
  "Kebbi State University of Science and Technology",
  "Kings University",
  "Kogi State University",
  "Kola Daisi University",
  "Kwara State University",
  "Kwararafa University, Wukari",
  "Ladoke Akintola University of Technology",
  "Lagos State University",
  "Landmark University",
  "Lead City University",
  "Legacy University, Okija",
  "Madonna University",
  "Mcpherson University",
  "Michael Okpara University of Agriculture Umudike",
  "Micheal and Cecilia Ibru University",
  "Modibbo Adama University of Technology",
  "Moshood Abiola University of Science and Technology, Abeokuta",
  "Mountain Top University",
  "Nasarawa State University",
  "Niger Delta University",
  "Nile University of Nigeria",
  "Nnamdi Azikiwe University",
  "Northwest University Kano",
  "Novena University",
  "Obafemi Awolowo University",
  "Obong University",
  "Oduduwa University",
  "Olabisi Onabanjo University",
  "Ondo State University of Science and Technology",
  "PAMO University of Medical Sciences",
  "Pan-Atlantic University",
  "Paul University",
  "Plateau State University",
  "Police Academy Wudil",
  "Precious Cornerstone University",
  "Redeemer's University",
  "Renaissance University",
  "Rhema University",
  "Ritman University",
  "Rivers State University",
  "Salem University",
  "Samuel Adegboyega University",
  "Skyline University Nigeria",
  "Sokoto State University",
  "Southwestern University, Nigeria",
  "Sule Lamido University",
  "Summit University Offa",
  "Tai Solarin University of Education",
  "Tansian University",
  "Taraba State University",
  "Umar Musa Yar'Adua University",
  "University of Abuja",
  "University of Africa",
  "University of Agriculture Makurdi",
  "University of Benin",
  "University of Calabar",
  "University of Ibadan",
  "University of Ilorin",
  "University of Jos",
  "University of Lagos",
  "University of Maiduguri",
  "University of Medical Sciences",
  "University of Mkar",
  "University of Nigeria Nsukka",
  "University of Nigeria, Enugu Campus",
  "University of Port Harcourt",
  "University of Uyo",
  "Usmanu Danfodiyo University",
  "Veritas University",
  "Wellspring University",
  "Wesley University of Science and Technology",
  "Western Delta University",
  "Yobe State University",
];

const BookingPage = () => {
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const { toast } = useToast()

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!origin || !destination || !date) {
       toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in origin, destination, and date.",
      })
      return;
    }

    // TODO: Implement actual booking logic (e.g., call an API)
    // Example: send booking data to backend
    // await createBooking({ userId: '...', origin, destination, date });

     toast({
        title: "Booking Request Submitted",
        description: `Ride from ${origin} to ${destination} on ${date ? format(date, 'PPP') : ''} requested. Check your profile for confirmation.`,
      })
    console.log('Booking details:', { origin, destination, date });
    // Optionally reset form fields after successful submission
    // setOrigin('');
    // setDestination('');
    // setDate(undefined);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/30">
      <Card className="w-full max-w-lg shadow-lg rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Book Your Ride</CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Select your origin, destination, and travel date.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBooking} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="origin" className="font-medium">Origin</Label>
              <Input
                id="origin"
                list="origin-list"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Enter or select starting point"
                required
                className="text-base md:text-sm" // Ensure consistent text size
              />
              <datalist id="origin-list">
                {nigerianLocations.map((location, index) => (
                  <option key={`${location}-origin-${index}`} value={location} />
                ))}
              </datalist>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination" className="font-medium">Destination</Label>
              <Input
                id="destination"
                list="destination-list"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter or select destination"
                required
                className="text-base md:text-sm" // Ensure consistent text size
              />
              <datalist id="destination-list">
                {nigerianLocations.map((location, index) => (
                  <option key={`${location}-dest-${index}`} value={location} />
                ))}
              </datalist>
            </div>
            <div className="grid gap-2">
              <Label className="font-medium">Travel Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal text-base md:text-sm", // Full width, consistent text size
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))} // Disable past dates
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Time of Departure info - Set by Admin */}
             <div className="text-sm text-muted-foreground text-center px-2 py-1 bg-muted rounded-md">
                Departure time will be assigned by the administrator.
             </div>

            <Button type="submit" className="w-full mt-2 text-base font-semibold py-3" size="lg">Request Ride</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingPage;
