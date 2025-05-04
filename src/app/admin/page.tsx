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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast";

// Mock data for recent bookings
const mockBookings = [
  { id: 'bk1', user: 'Alice', origin: 'Library', destination: 'Dormitory A', date: '2024-08-15', status: 'Confirmed' },
  { id: 'bk2', user: 'Bob', origin: 'Cafeteria', destination: 'Gymnasium', date: '2024-08-15', status: 'Pending' },
  { id: 'bk3', user: 'Charlie', origin: 'Lecture Hall B', destination: 'Student Union', date: '2024-08-16', status: 'Confirmed' },
];


const AdminPage = () => {
  const [paymentId, setPaymentId] = React.useState('');
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [cost, setCost] = React.useState(0);
  const [travelerId, setTravelerId] = React.useState('');
  const [vehicleId, setVehicleId] = React.useState('');
  const { toast } = useToast()

  const handleConfirmPayment = async () => {
    if (!paymentId) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a Payment ID." });
      return;
    }
    try {
      const confirmation = await confirmPayment(paymentId);
      toast({
        title: "Payment Confirmed",
        description: `Payment ${confirmation.paymentId} is ${confirmation.status}`,
      })
      setPaymentId(''); // Clear input after success
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
     if (!origin || !destination || cost <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please fill in all fields correctly." });
      return;
    }
    try {
      const updatedCost = await updateTransportationCost({ origin, destination, cost });
      toast({
        title: "Transportation Cost Updated",
        description: `Updated cost from ${updatedCost.origin} to ${updatedCost.destination}: $${updatedCost.cost}`,
      })
      // Clear inputs after success
      setOrigin('');
      setDestination('');
      setCost(0);
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
     if (!travelerId) {
        toast({ variant: "destructive", title: "Error", description: "Please enter a Traveler ID." });
        return;
     }
    try {
      // vehicleId is hardcoded in the service for now, pass an empty string or default value
      const assignment = await assignTravelerToVehicle({ travelerId, vehicleId: 'defaultVehicle' });
       toast({
        title: "Traveler Assigned to Vehicle",
        description: `Traveler ${assignment.travelerId} assigned to vehicle ${assignment.vehicleId}`,
      })
      setTravelerId(''); // Clear input after success
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="mb-8">
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

        <Card className="mb-8">
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
              <Input type="number" id="cost" value={cost === 0 ? '' : cost.toString()} onChange={(e) => setCost(parseFloat(e.target.value) || 0)} min="0" step="0.01"/>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdateTransportationCost}>Update Cost</Button>
          </CardFooter>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Assign Traveler to Vehicle</CardTitle>
            <CardDescription>Assign a traveler to a specific vehicle.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="travelerId">Traveler ID</Label>
              <Input id="travelerId" value={travelerId} onChange={(e) => setTravelerId(e.target.value)} />
            </div>
            {/* Vehicle Id assignment logic can be added later if needed */}
          </CardContent>
          <CardFooter>
            <Button onClick={handleAssignTravelerToVehicle}>Assign Traveler</Button>
          </CardFooter>
        </Card>
      </div>

       <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Overview of the latest ride bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of recent bookings.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.user}</TableCell>
                  <TableCell>{booking.origin}</TableCell>
                  <TableCell>{booking.destination}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
