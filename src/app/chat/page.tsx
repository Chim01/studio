"use client";
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <h1 className="text-4xl font-bold text-primary mb-8">Real-time Chat Support</h1>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Chat with Admin</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="overflow-y-auto h-64 p-2">
            {messages.map((msg, index) => (
              <div key={index} className="text-sm mb-2 p-2 rounded-md bg-secondary">
                {msg}
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
