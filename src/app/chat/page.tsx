"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { chatSupport, ChatSupportInput } from '@/ai/flows/chat-support-flow'; // Import the flow
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

interface Message {
  text: string;
  sender: 'user' | 'ai' | 'system'; // system for loading state
}

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll whenever messages update


  const sendMessage = async () => {
    const userMessage = message.trim();
    if (userMessage === '' || isLoading) {
      return; // Don't send empty messages or while loading
    }

    // Add user message to chat
    const newMessages: Message[] = [...messages, { text: userMessage, sender: 'user' }];
    setMessages(newMessages);
    setMessage('');
    setIsLoading(true); // Set loading state

    // Prepare input for the AI flow, including history
    const historyForAI = newMessages
      .filter(msg => msg.sender === 'user' || msg.sender === 'ai') // Only user/AI messages
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        content: msg.text
      }));

    // Remove the last user message from history as it's the current input
    historyForAI.pop();

    const flowInput: ChatSupportInput = {
        userMessage: userMessage,
        history: historyForAI.length > 0 ? historyForAI : undefined,
      };


    try {
      // Call the Genkit flow
      const result = await chatSupport(flowInput);

      // Add AI response to chat
      setMessages(prevMessages => [...prevMessages, { text: result.response, sender: 'ai' }]);
    } catch (error) {
      console.error("Error calling chat support flow:", error);
      // Add an error message to the chat
      setMessages(prevMessages => [...prevMessages, { text: "Sorry, I encountered an error. Please try again.", sender: 'system' }]);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-8 px-4"> {/* Adjusted height */}
      <h1 className="text-4xl font-bold text-primary mb-8">Real-time Chat Support</h1>

      <Card className="w-full max-w-md flex flex-col h-[60vh]"> {/* Fixed height */}
        <CardHeader>
          <CardTitle>Chat with Support Bot</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow space-y-4 overflow-hidden">
          <ScrollArea className="flex-grow p-2 pr-4" ref={scrollAreaRef}> {/* Added ScrollArea */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "text-sm mb-2 p-3 rounded-lg shadow-sm max-w-[80%]",
                  msg.sender === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-secondary',
                  msg.sender === 'system' && 'bg-destructive text-destructive-foreground text-center max-w-full'
                )}
              >
                {msg.text}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-center space-x-2 mt-2">
                <Skeleton className="h-8 w-8 rounded-full bg-muted" />
                <Skeleton className="h-6 w-3/5 rounded-md bg-muted" />
              </div>
            )}
          </ScrollArea>

          <div className="flex items-center space-x-2 pt-4 border-t"> {/* Added border-t */}
            <Input
              type="text"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown} // Added key down handler
              disabled={isLoading} // Disable input while loading
            />
            <Button onClick={sendMessage} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
