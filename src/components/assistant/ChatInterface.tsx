"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Bot, Send, Sparkles, Zap, HelpCircle, Repeat, Briefcase, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/lib/types";
import { mockUser } from "@/lib/data";
import { guideOnboarding } from "@/ai/flows/guide-onboarding-conversationally";
import { useToast } from "@/hooks/use-toast";

const quickActions = [
    { label: "Analyze my budget", icon: Sparkles },
    { label: "Why am I overspending?", icon: HelpCircle },
    { label: "Predict my month-end spend", icon: Zap },
    { label: "Give me a new budget plan", icon: Repeat },
    { label: "I got a new job", icon: Briefcase },
    { label: "Update my rent", icon: Home },
];

export function ChatInterface({
  initialMessages = [],
}: {
  initialMessages?: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm FinAI, your personal finance assistant. How can I help you today?",
    },
    ...initialMessages,
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (messageContent?: string) => {
    const text = messageContent || input;
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const history = newMessages
        .filter(m => typeof m.content === 'string')
        .map(m => ({
            role: m.role,
            content: m.content as string
        }));

      const aiResponse = await guideOnboarding({ userInput: text, conversationHistory: history });

      const assistantResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse.response,
      };
      setMessages((prev) => [...prev, assistantResponse]);
    } catch (error) {
        console.error("AI Error:", error);
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "Sorry, I couldn't get a response from the AI. Please check your API key and try again."
        })
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-10rem)]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 border-2 border-primary">
                  <AvatarFallback>
                    <Bot className="h-5 w-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-md rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {typeof message.content === 'string' ? <p>{message.content}</p> : message.content}
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                  <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 border-2 border-primary">
                    <AvatarFallback>
                        <Bot className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                </Avatar>
                <div className="max-w-md rounded-lg p-3 bg-muted">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-foreground rounded-full animate-pulse"></span>
                    </div>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 pb-4">
                {quickActions.map(action => (
                    <Button key={action.label} variant="outline" size="sm" onClick={() => handleSendMessage(action.label)}>
                        <action.icon className="h-4 w-4 mr-2" />
                        {action.label}
                    </Button>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI assistant..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
