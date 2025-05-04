"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const [name, setName] = React.useState('John Doe');
  const [email, setEmail] = React.useState('john.doe@example.com');
  const [paymentInfo, setPaymentInfo] = React.useState('**** **** **** 1234');

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 px-4">
      <h1 className="text-4xl font-bold text-primary mb-8">User Profile</h1>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Manage Your Profile</CardTitle>
          <CardDescription>Update your personal information and manage your payment details.</CardDescription>
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
          <div className="grid gap-2">
            <Label htmlFor="payment">Payment Information</Label>
            <Input id="payment" type="text" value={paymentInfo} onChange={(e) => setPaymentInfo(e.target.value)} />
          </div>
        </CardContent>
        <Button className="w-full mt-4">Update Profile</Button>
      </Card>

      <Card className="w-full max-w-md mt-8">
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
          <CardDescription>View your past and upcoming ride bookings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-muted-foreground">No bookings yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
