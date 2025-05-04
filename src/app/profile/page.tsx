"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const [name, setName] = React.useState('John Doe');
  const [email, setEmail] = React.useState('john.doe@example.com');
  const [paymentInfo, setPaymentInfo] = React.useState('**** **** **** 1234');
  const [preferredVehicle, setPreferredVehicle] = React.useState('any');
  const [quietRide, setQuietRide] = React.useState(false);
  const { toast } = useToast();

  const handleUpdateProfile = () => {
     // TODO: Add actual update logic (e.g., API call)
    console.log("Updating profile:", { name, email, paymentInfo, preferredVehicle, quietRide });
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  }

    const handleUpdateBookingHistory = () => {
    // TODO: Add logic to fetch and display booking history
     toast({
      title: "Booking History",
      description: "Fetching your booking history...",
    });
    console.log("Fetching booking history...");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">User Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Manage your payment methods.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <div className="grid gap-2">
              <Label htmlFor="payment">Payment Information</Label>
              {/* Consider using a more secure component for payment input in a real app */}
              <Input id="payment" type="text" value={paymentInfo} onChange={(e) => setPaymentInfo(e.target.value)} placeholder="Add payment method"/>
            </div>
             <Button variant="outline" size="sm">Add New Method</Button>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Ride Preferences</CardTitle>
            <CardDescription>Set your preferred ride options.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="vehicle-preference">Preferred Vehicle Type</Label>
              <Select value={preferredVehicle} onValueChange={setPreferredVehicle}>
                <SelectTrigger id="vehicle-preference">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="flex items-center justify-between space-x-2 mt-4">
              <Label htmlFor="quiet-ride">Quiet Ride Preferred</Label>
              <Switch
                id="quiet-ride"
                checked={quietRide}
                onCheckedChange={setQuietRide}
              />
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
            <CardDescription>View your past and upcoming ride bookings.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             {/* Placeholder for booking history - replace with actual data display */}
             <div className="text-center text-muted-foreground py-4">
                <p>Your past bookings will appear here.</p>
             </div>
            <Button variant="secondary" onClick={handleUpdateBookingHistory}>View Full History</Button>
          </CardContent>
        </Card>
      </div>

       <div className="mt-8 flex justify-center">
          <Button onClick={handleUpdateProfile} size="lg">Save Changes</Button>
       </div>

    </div>
  );
};

export default ProfilePage;
