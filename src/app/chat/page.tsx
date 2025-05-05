// src/app/chat/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // Import Firebase auth and db instance
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { useToast } from "@/hooks/use-toast";
import ChatLoading from './loading'; // Import the loading component

interface Message {
  id?: string; // Firestore document ID
  text: string;
  senderId: string; // 'user' or 'admin' or specific admin ID
  senderType: 'user' | 'admin';
  timestamp: Timestamp | null; // Firestore Timestamp or null while pending
}

interface ChatMetadata {
    userId: string;
    userName?: string | null;
    lastMessageTimestamp: Timestamp | null;
    unreadByUser: boolean;
    unreadByAdmin: boolean;
}


const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state for sending messages
  const [authLoading, setAuthLoading] = useState(true); // Loading state for auth check
  const [user, setUser] = useState<User | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    setTimeout(() => { // Delay slightly to ensure DOM is updated
        if (scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
        }
    }, 100); // Small delay
  };

   useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll whenever messages update

  // Authentication Check and Firestore Listener Setup
  useEffect(() => {
    if (!auth || !db) {
      console.warn("Auth or DB service not ready in chat page.");
      setAuthLoading(false);
      toast({ title: "Error", description: "Chat service unavailable.", variant: "destructive" });
      router.push('/auth/login');
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setAuthLoading(false); // User is logged in, stop auth loading

        // Setup Firestore listener for this user's chat
        const messagesRef = collection(db, `chats/${currentUser.uid}/messages`);
        const q = query(messagesRef, orderBy("timestamp", "asc")); // Order by timestamp

        const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
          const fetchedMessages: Message[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            fetchedMessages.push({
              id: doc.id,
              text: data.text,
              senderId: data.senderId,
              senderType: data.senderType,
              timestamp: data.timestamp as Timestamp, // Assert type
            });
          });
          setMessages(fetchedMessages);
          // Mark messages as read by user when they load/update
          markChatAsReadByUser(currentUser.uid);
        }, (error) => {
          console.error("Error fetching messages: ", error);
          toast({ title: "Error", description: "Could not load messages.", variant: "destructive" });
        });

        return () => {
            console.log("Unsubscribing Firestore listener for user:", currentUser.uid);
            unsubscribeFirestore(); // Cleanup Firestore listener on user change or unmount
        };

      } else {
        // User is not logged in
        setUser(null);
        setAuthLoading(false);
        toast({
          title: "Authentication Required",
          description: "Please log in to access chat.",
          variant: "destructive",
        });
        router.push('/auth/login');
      }
    }, (error) => {
      console.error("Auth state error in chat:", error);
      setAuthLoading(false);
      toast({ title: "Authentication Error", description: "Could not verify user.", variant: "destructive" });
      router.push('/auth/login');
    });

    // Cleanup auth subscription on unmount
    return () => {
        console.log("Unsubscribing Auth listener for chat page.");
        unsubscribeAuth();
    }
  }, [router, toast]); // Dependencies

  // Function to mark chat as read by user
  const markChatAsReadByUser = async (userId: string) => {
    if (!db) return;
    const chatMetadataRef = doc(db, 'chatMetadata', userId);
    try {
      await setDoc(chatMetadataRef, { unreadByUser: false }, { merge: true });
      console.log("Chat marked as read by user:", userId);
    } catch (error) {
      console.error("Error marking chat as read by user:", error);
    }
  };

  // Function to update chat metadata (for admin)
  const updateChatMetadata = async (userId: string, userName: string | null) => {
      if (!db) return;
      const chatMetadataRef = doc(db, 'chatMetadata', userId);
      try {
          const docSnap = await getDoc(chatMetadataRef);
          const metadataUpdate: Partial<ChatMetadata> = {
              lastMessageTimestamp: serverTimestamp() as Timestamp, // Use server timestamp
              unreadByAdmin: true, // New message is unread by admin
          };
          // Only set username if it doesn't exist or is different
          if (!docSnap.exists() || docSnap.data()?.userName !== userName) {
              metadataUpdate.userName = userName;
          }
          // Set unreadByUser to false initially when user sends a message
          metadataUpdate.unreadByUser = false;

          await setDoc(chatMetadataRef, metadataUpdate, { merge: true });
          console.log("Chat metadata updated for user:", userId);
      } catch (error) {
          console.error("Error updating chat metadata:", error);
      }
  }

  const sendMessage = async () => {
    const userMessageText = message.trim();
    if (userMessageText === '' || isLoading || !user || !db) {
      return; // Don't send empty messages, while loading, or if user/db not available
    }

    setIsLoading(true); // Set loading state
    setMessage(''); // Clear input immediately

    const newMessage: Omit<Message, 'id' | 'timestamp'> & { timestamp: any } = { // Use 'any' for serverTimestamp temporarily
      text: userMessageText,
      senderId: user.uid,
      senderType: 'user',
      timestamp: serverTimestamp(), // Use Firestore server timestamp
    };

    try {
      // Add message to the user's specific chat collection
      const messagesRef = collection(db, `chats/${user.uid}/messages`);
      await addDoc(messagesRef, newMessage);
      console.log("Message sent successfully by user:", user.uid);

      // Update metadata for admin view
      await updateChatMetadata(user.uid, user.displayName);

    } catch (error) {
      console.error("Error sending message:", error);
      toast({ title: "Error", description: "Could not send message.", variant: "destructive" });
      // Optionally, add the failed message back to the input or show an error indicator
      setMessage(userMessageText); // Put message back in input on failure
    } finally {
      setIsLoading(false); // Clear loading state
    }
  };

  // Handle Enter key press in the input field
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default form submission or line break
      sendMessage();
    }
  };

  // Show loading indicator while checking auth status
  if (authLoading) {
    return <ChatLoading />; // Render the loading component
  }

   // If user is null after loading, redirect would have happened, but return null briefly
   if (!user) {
     return null; // Or a minimal message, though redirect should handle it
   }


  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-8 px-4">
      <Card className="w-full max-w-md flex flex-col h-[60vh] shadow-lg rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Chat with Admin</CardTitle>
           <CardDescription className="text-muted-foreground pt-1">
            Ask questions or report issues regarding your bookings.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow space-y-4 overflow-hidden">
          <ScrollArea className="flex-grow p-2 pr-4" ref={scrollAreaRef}>
            {messages.map((msg) => (
              <div
                key={msg.id || Math.random()} // Use doc ID or fallback for pending messages
                className={cn(
                  "text-sm mb-2 p-3 rounded-lg shadow-sm max-w-[80%]",
                   msg.senderType === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground',
                   // Add styling for admin messages if needed
                )}
              >
                <p>{msg.text}</p>
                 <p className={cn("text-xs mt-1 opacity-70", msg.senderType === 'user' ? 'text-right' : 'text-left')}>
                    {/* Format timestamp nicely */}
                    {msg.timestamp ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                 </p>
              </div>
            ))}
             {isLoading && ( // Show skeleton only when sending a message
              <div className="flex items-center space-x-2 mt-2 ml-auto"> {/* Align right for user sending */}
                <Skeleton className="h-6 w-3/5 rounded-md bg-muted" />
                <Skeleton className="h-8 w-8 rounded-full bg-muted" />
              </div>
            )}
              {messages.length === 0 && !authLoading && !isLoading && (
                 <p className="text-center text-muted-foreground p-4">Start the conversation!</p>
              )}
          </ScrollArea>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Input
              type="text"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || authLoading} // Disable while sending or initial auth loading
              className="text-base md:text-sm"
            />
            <Button onClick={sendMessage} disabled={isLoading || authLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;