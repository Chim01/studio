// src/app/admin/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
  doc,
  setDoc,
  where,
  limit,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // Import auth and db
import { confirmPayment } from '@/services/payment';
import { updateTransportationCost } from '@/services/transportation';
import { assignTravelerToVehicle } from '@/services/vehicle-assignment';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
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
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import AdminLoading from './loading';
import { useRouter } from 'next/navigation';


// Mock data for recent bookings (can be replaced with Firestore data later)
const mockBookings = [
  { id: 'bk1', user: 'Alice', origin: 'Library', destination: 'Dormitory A', date: '2024-08-15', status: 'Confirmed' },
  { id: 'bk2', user: 'Bob', origin: 'Cafeteria', destination: 'Gymnasium', date: '2024-08-15', status: 'Pending' },
  { id: 'bk3', user: 'Charlie', origin: 'Lecture Hall B', destination: 'Student Union', date: '2024-08-16', status: 'Confirmed' },
];

// --- Types for Chat ---
interface ChatMetadata {
    userId: string;
    userName?: string | null;
    lastMessageTimestamp: Timestamp | null;
    unreadByUser: boolean;
    unreadByAdmin: boolean;
}

interface Message {
  id?: string;
  text: string;
  senderId: string;
  senderType: 'user' | 'admin';
  timestamp: Timestamp | null;
}
// --- ---

// Simple Admin Check (Replace with robust role-based access control in production)
const ADMIN_UIDS = ['YOUR_ADMIN_USER_ID_1', 'YOUR_ADMIN_USER_ID_2']; // Add actual Admin UIDs

const AdminPage = () => {
  const [paymentId, setPaymentId] = React.useState('');
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [cost, setCost] = React.useState(0);
  const [travelerId, setTravelerId] = React.useState('');
  // const [vehicleId, setVehicleId] = React.useState(''); // Currently unused
  const { toast } = useToast()

  // --- Chat State ---
  const [chatList, setChatList] = useState<ChatMetadata[]>([]);
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState<Message[]>([]);
  const [adminMessage, setAdminMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [chatLoading, setChatLoading] = useState(true); // Loading for chat list
  const [messagesLoading, setMessagesLoading] = useState(false); // Loading for specific chat messages
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);
  // --- ---

  // --- Auth State ---
   const [user, setUser] = useState<User | null>(null);
   const [authLoading, setAuthLoading] = useState(true);
   const router = useRouter();
  // --- ---


   // Function to scroll chat to bottom
  const scrollChatToBottom = () => {
    setTimeout(() => {
        if (chatScrollAreaRef.current) {
            const scrollViewport = chatScrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (scrollViewport) {
                scrollViewport.scrollTop = scrollViewport.scrollHeight;
            }
        }
     }, 100);
  };

   useEffect(() => {
    scrollChatToBottom();
  }, [selectedChatMessages]);


  // --- Authentication and Admin Check ---
  useEffect(() => {
      if (!auth) {
          setAuthLoading(false);
          toast({ title: "Error", description: "Authentication service unavailable.", variant: "destructive" });
          router.push('/'); // Redirect if auth is not ready
          return;
      }
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setAuthLoading(false);
          // **SECURITY:** Check if the logged-in user is an admin. Redirect if not.
          // Replace this with a proper role check (e.g., using custom claims) in production.
          // if (!currentUser || !ADMIN_UIDS.includes(currentUser.uid)) {
           if (!currentUser) { // Basic check if user exists - ADD ROLE CHECK LATER
              toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
              router.push('/'); // Redirect non-admins
          } else {
              // User is likely an admin (based on basic check), proceed to load admin data
              console.log("Admin user detected:", currentUser.uid);
              // Load initial chat list here or in another effect
          }
      }, (error) => {
          console.error("Auth state error in admin:", error);
          setUser(null);
          setAuthLoading(false);
          toast({ title: "Authentication Error", description: "Could not verify user.", variant: "destructive" });
          router.push('/auth/login');
      });
      return () => unsubscribe();
  }, [router, toast]);
  // --- ---


  // --- Firestore Listener for Chat List ---
  useEffect(() => {
    // Only run if user is authenticated and is an admin (basic check for now)
    if (!user || authLoading || !db) {
         setChatLoading(false); // Ensure loading stops if prerequisites aren't met
         return;
     }
     // if (!ADMIN_UIDS.includes(user.uid)) return; // Add proper admin check later

    setChatLoading(true);
    const metadataRef = collection(db, 'chatMetadata');
    // Order by last message time, descending, show unread first maybe?
    const q = query(metadataRef, orderBy('lastMessageTimestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chats: ChatMetadata[] = [];
      querySnapshot.forEach((doc) => {
        chats.push({ userId: doc.id, ...doc.data() } as ChatMetadata);
      });
      setChatList(chats);
      setChatLoading(false);
    }, (error) => {
      console.error("Error fetching chat list:", error);
      toast({ title: "Error", description: "Could not load chat list.", variant: "destructive" });
      setChatLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, [user, authLoading, toast]); // Depend on user and authLoading
  // --- ---


  // --- Firestore Listener for Selected Chat Messages ---
  useEffect(() => {
    if (!selectedChatUserId || !db) {
        setSelectedChatMessages([]); // Clear messages if no chat is selected
        setMessagesLoading(false);
        return;
    }

    setMessagesLoading(true);
    const messagesRef = collection(db, `chats/${selectedChatUserId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setSelectedChatMessages(messages);
      setMessagesLoading(false);
       // Mark chat as read by admin when messages are loaded/updated
      markChatAsReadByAdmin(selectedChatUserId);
    }, (error) => {
      console.error("Error fetching messages for chat:", selectedChatUserId, error);
      toast({ title: "Error", description: "Could not load messages for this chat.", variant: "destructive" });
      setMessagesLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener when selected chat changes

  }, [selectedChatUserId, toast]);
  // --- ---

   // Function to mark chat as read by admin
  const markChatAsReadByAdmin = async (userId: string) => {
    if (!db) return;
    const chatMetadataRef = doc(db, 'chatMetadata', userId);
    try {
      await setDoc(chatMetadataRef, { unreadByAdmin: false }, { merge: true });
      console.log("Chat marked as read by admin:", userId);
    } catch (error) {
      console.error("Error marking chat as read by admin:", error);
    }
  };


    // Function to update chat metadata (when admin sends message)
   const updateChatMetadataAdmin = async (userId: string) => {
      if (!db) return;
      const chatMetadataRef = doc(db, 'chatMetadata', userId);
      try {
          // Update timestamp and mark as unread for the *user*
          await setDoc(chatMetadataRef, {
              lastMessageTimestamp: serverTimestamp(),
              unreadByUser: true, // New message from admin is unread by user
              unreadByAdmin: false, // Admin just sent, so it's read by admin
          }, { merge: true });
          console.log("Chat metadata updated by admin for user:", userId);
      } catch (error) {
          console.error("Error updating chat metadata by admin:", error);
      }
   }


  // --- Admin Action Handlers ---
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
      const assignment = await assignTravelerToVehicle({ travelerId, vehicleId: 'defaultVehicle' });
       toast({
        title: "Traveler Assigned to Vehicle",
        description: `Traveler ${assignment.travelerId} assigned to vehicle ${assignment.vehicleId}`,
      })
      setTravelerId('');
    } catch (error) {
      console.error("Failed to assign traveler to vehicle:", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign traveler to vehicle",
      })
    }
  };

  // --- Send Admin Message Handler ---
  const handleSendAdminMessage = async () => {
    const messageText = adminMessage.trim();
    if (messageText === '' || !selectedChatUserId || !user || !db || isSendingMessage) {
      return;
    }

    setIsSendingMessage(true);
    setAdminMessage(''); // Clear input

    const newMessage: Omit<Message, 'id' | 'timestamp'> & { timestamp: any } = {
      text: messageText,
      senderId: user.uid, // Admin's UID
      senderType: 'admin',
      timestamp: serverTimestamp(),
    };

    try {
      const messagesRef = collection(db, `chats/${selectedChatUserId}/messages`);
      await addDoc(messagesRef, newMessage);
      console.log("Admin message sent successfully to chat:", selectedChatUserId);

      // Update metadata for the user
      await updateChatMetadataAdmin(selectedChatUserId);

    } catch (error) {
      console.error("Error sending admin message:", error);
      toast({ title: "Error", description: "Could not send message.", variant: "destructive" });
      setAdminMessage(messageText); // Put message back in input
    } finally {
      setIsSendingMessage(false);
    }
  };

   // Handle Enter key press in admin message input
  const handleAdminMessageKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendAdminMessage();
    }
  };
  // --- ---


   if (authLoading) {
    return <AdminLoading />;
  }

  // Add this check after authLoading is false
  if (!user /* || !ADMIN_UIDS.includes(user.uid) */ ) {
      // Although the redirect should happen, this prevents rendering the admin UI briefly for non-admins
      return (
          <div className="flex flex-col items-center justify-center min-h-screen">
              <p className="text-destructive">Access Denied.</p>
          </div>
      );
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Admin Dashboard</h1>

      {/* Row for Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Confirm Payment Card */}
        <Card>
          <CardHeader>
            <CardTitle>Confirm Payment</CardTitle>
            <CardDescription>Confirm a payment by ID.</CardDescription>
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

        {/* Update Cost Card */}
        <Card>
          <CardHeader>
            <CardTitle>Update Transportation Cost</CardTitle>
            <CardDescription>Set cost between locations.</CardDescription>
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

        {/* Assign Traveler Card */}
        <Card>
          <CardHeader>
            <CardTitle>Assign Traveler to Vehicle</CardTitle>
            <CardDescription>Assign traveler to a vehicle.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="travelerId">Traveler ID</Label>
              <Input id="travelerId" value={travelerId} onChange={(e) => setTravelerId(e.target.value)} />
            </div>
            {/* Vehicle ID Input (optional) */}
            {/* <div className="grid gap-2">
              <Label htmlFor="vehicleId">Vehicle ID</Label>
              <Input id="vehicleId" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} />
            </div> */}
          </CardContent>
          <CardFooter>
            <Button onClick={handleAssignTravelerToVehicle}>Assign Traveler</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Row for Chat and Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Chat Section */}
        <Card className="lg:col-span-1 flex flex-col h-[70vh]"> {/* Give chat a fixed height */}
            <CardHeader>
                <CardTitle>User Chats</CardTitle>
                <CardDescription>Select a user to view and respond to messages.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-grow overflow-hidden">
                 {/* Chat List (Left Side) */}
                <ScrollArea className="w-1/3 border-r pr-4">
                    {chatLoading ? (
                        Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full mb-2 rounded-md"/>)
                    ) : chatList.length === 0 ? (
                         <p className="text-muted-foreground text-sm p-2">No active chats.</p>
                    ) : (
                        chatList.map((chat) => (
                        <Button
                            key={chat.userId}
                            variant={selectedChatUserId === chat.userId ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start mb-2 h-auto py-2 px-3 text-left",
                                chat.unreadByAdmin && "font-bold" // Highlight unread
                            )}
                            onClick={() => setSelectedChatUserId(chat.userId)}
                        >
                           <div className="flex flex-col">
                             <span>{chat.userName || chat.userId}</span>
                             <span className="text-xs text-muted-foreground">
                                 {chat.lastMessageTimestamp ? new Date(chat.lastMessageTimestamp.seconds * 1000).toLocaleString() : 'No messages'}
                             </span>
                           </div>
                            {chat.unreadByAdmin && <span className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse"></span>}
                        </Button>
                        ))
                    )}
                </ScrollArea>

                 {/* Selected Chat View (Right Side) */}
                <div className="w-2/3 pl-4 flex flex-col">
                    {selectedChatUserId ? (
                        <>
                            <ScrollArea className="flex-grow mb-4 p-2 border rounded-md" ref={chatScrollAreaRef}>
                                {messagesLoading ? (
                                    Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className={cn("h-10 w-3/4 mb-2 rounded-md", i % 2 === 0 ? '' : 'ml-auto')}/>)
                                ) : selectedChatMessages.length === 0 ? (
                                    <p className="text-muted-foreground text-sm p-4 text-center">No messages in this chat yet.</p>
                                ) : (
                                    selectedChatMessages.map((msg) => (
                                        <div
                                            key={msg.id || Math.random()}
                                            className={cn(
                                            "text-sm mb-2 p-3 rounded-lg shadow-sm max-w-[85%]",
                                            msg.senderType === 'admin' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground',
                                            )}
                                        >
                                            <p>{msg.text}</p>
                                            <p className={cn("text-xs mt-1 opacity-70", msg.senderType === 'admin' ? 'text-right' : 'text-left')}>
                                                {msg.timestamp ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </ScrollArea>
                             <div className="flex items-center space-x-2">
                                <Textarea
                                    placeholder="Type your message..."
                                    value={adminMessage}
                                    onChange={(e) => setAdminMessage(e.target.value)}
                                    onKeyDown={handleAdminMessageKeyDown}
                                    disabled={isSendingMessage || messagesLoading}
                                    rows={2}
                                    className="text-sm flex-grow resize-none"
                                />
                                <Button onClick={handleSendAdminMessage} disabled={isSendingMessage || messagesLoading}>
                                    {isSendingMessage ? 'Sending...' : 'Send'}
                                </Button>
                             </div>
                        </>
                    ) : (
                        <div className="flex flex-grow items-center justify-center text-muted-foreground">
                            Select a chat to view messages.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>


        {/* Recent Bookings Table */}
        <Card className="lg:col-span-1">
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
                    {/* Add Action Head if needed */}
                    {/* <TableHead>Action</TableHead> */}
                </TableRow>
                </TableHeader>
                <TableBody>
                 {/* TODO: Replace mockBookings with data fetched from Firestore */}
                {mockBookings.map((booking) => (
                    <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.user}</TableCell>
                    <TableCell>{booking.origin}</TableCell>
                    <TableCell>{booking.destination}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    {/* Add Action Cell if needed */}
                    {/* <TableCell> <Button variant="outline" size="sm">Details</Button> </TableCell> */}
                    </TableRow>
                ))}
                {mockBookings.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">No recent bookings.</TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>

      </div>


    </div>
  );
};

export default AdminPage;