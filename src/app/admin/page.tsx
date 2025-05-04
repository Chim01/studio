"use client";

import React from 'react';
import { confirmPayment } from '@/services/payment';
import { updateTransportationCost } from '@/services/transportation';
import { assignTravelerToVehicle } from '@/services/vehicle-assignment';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast";

const AdminPage = () => {
  const [paymentId, setPaymentId] = React.useState('');
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [cost, setCost] = React.useState(0);
  const [travelerId, setTravelerId] = React.useState('');
  const [vehicleId, setVehicleId] = React.useState('');
  const { toast } = useToast()

  const handleConfirmPayment = async () => {
    try {
      const confirmation = await confirmPayment(paymentId);
      toast({
        title: "Payment Confirmed",
        description: `Payment ${confirmation.paymentId} is ${confirmation.status}`,
      })
    } catch (error) {
      console.error("Failed to confirm payment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to confirm payment",
      })
    }
  };

  const handleUpdateTransportationCost = async () => {
    try {
      const updatedCost = await updateTransportationCost({ origin, destination, cost });
      toast({
        title: "Transportation Cost Updated",
        description: `Updated cost from ${updatedCost.origin} to ${updatedCost.destination}: $${updatedCost.cost}`,
      })
    } catch (error) {
      console.error("Failed to update transportation cost:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update transportation cost",
      })
    }
  };

  const handleAssignTravelerToVehicle = async () => {
    try {
      const assignment = await assignTravelerToVehicle({ travelerId, vehicleId });
       toast({
        title: "Traveler Assigned to Vehicle",
        description: `Traveler ${assignment.travelerId} assigned to vehicle ${assignment.vehicleId}`,
      })
    } catch (error) {
      console.error("Failed to assign traveler to vehicle:", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign traveler to vehicle",
      })
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-8 px-4">
      <h1 className="text-4xl font-bold text-primary mb-8">Admin Dashboard</h1>

      <Card className="w-full max-w-md mb-8">
        <CardHeader>
          <CardTitle>Confirm Payment</CardTitle>
          <CardDescription>Confirm a payment by entering the payment ID.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="paymentId">Payment ID</Label>
            <Input id="paymentId" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleConfirmPayment}>Confirm Payment</Button>
        </CardFooter>
      </Card>

      <Card className="w-full max-w-md mb-8">
        <CardHeader>
          <CardTitle>Update Transportation Cost</CardTitle>
          <CardDescription>Update the transportation cost between two locations.</CardDescription>
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
            <Label htmlFor="cost">Cost</Label>
            <Input type="number" id="cost" value={cost.toString()} onChange={(e) => setCost(parseFloat(e.target.value))} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdateTransportationCost}>Update Cost</Button>
        </CardFooter>
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Assign Traveler to Vehicle</CardTitle>
          <CardDescription>Assign a traveler to a specific vehicle.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="travelerId">Traveler ID</Label>
            <Input id="travelerId" value={travelerId} onChange={(e) => setTravelerId(e.target.value)} />
          </div>
          {/* Vehicle Id is currently not necessary
          <div className="grid gap-2">
            <Label htmlFor="vehicleId">Vehicle ID</Label>
            <Input id="vehicleId" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} />
          </div> */}
        </CardContent>
        <CardFooter>
          <Button onClick={handleAssignTravelerToVehicle}>Assign Traveler</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminPage;
