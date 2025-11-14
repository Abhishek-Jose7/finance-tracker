"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Bot, Send, Sparkles, Zap, HelpCircle, Repeat, Briefcase, Home, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/lib/types";
import { mockUser } from "@/lib/data";
import { guideOnboarding } from "@/ai/flows/guide-onboarding-conversationally";
import { generalFinancialAssistant } from "@/ai/flows/general-financial-assistant";
import { useToast } from "@/hooks/use-toast";
import { saveChatMessage, getChatHistory, getUserPreferences, updateUserPreferences, clearChatHistory } from "@/lib/chat-actions";
import { useAppContext } from "@/context/AppContext";

const quickActions = [
    { label: "Analyze my budget", icon: Sparkles },
    { label: "Why am I overspending?", icon: HelpCircle },
    { label: "Predict my month-end spend", icon: Zap },
    { label: "Give me savings tips", icon: Repeat },
    { label: "Show spending trends", icon: Briefcase },
    { label: "Help me save for goals", icon: Home },
];

export function ChatInterface({
  initialMessages = [],
}: {
  initialMessages?: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [userContext, setUserContext] = useState<string>("");
  const { toast } = useToast();
  const { userProfile, transactions, categories } = useAppContext();

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
    loadUserContext();
  }, []);

  const loadChatHistory = async () => {
    setLoadingHistory(true);
    const result = await getChatHistory(50);
    
    if (result.error) {
      console.error("Error loading chat history:", result.error);
      // Start with welcome message if no history
      setMessages([{
        id: "1",
        role: "assistant",
        content: `Hello! I'm FinAI, your personal finance assistant. ${userProfile?.name ? `Nice to see you again, ${userProfile.name}!` : ''} How can I help you today?`,
      }]);
    } else if (result.data && result.data.length > 0) {
      setMessages(result.data.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
      })));
    } else {
      // First time user
      setMessages([{
        id: "1",
        role: "assistant",
        content: `Hello! I'm FinAI, your personal finance assistant. ${userProfile?.name ? `Welcome, ${userProfile.name}!` : ''} How can I help you today?`,
      }]);
    }
    setLoadingHistory(false);
  };

  const loadUserContext = async () => {
    const result = await getUserPreferences();
    if (result.data) {
      setUserContext(result.data.ai_context || "");
    }
  };

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

    // Save user message to database
    await saveChatMessage("user", text);

    try {
      const history = newMessages
        .filter(m => typeof m.content === 'string')
        .map(m => ({
            role: m.role,
            content: m.content as string
        }));

      // Prepare user financial context with actual data
      const totalSpent = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
      
      const categoryData = categories.map(cat => ({
        name: cat.name,
        budget: cat.budget,
        spent: cat.spent,
      }));

      const recentTransactions = transactions
        .slice(0, 10)
        .map(t => ({
          description: t.description,
          amount: t.amount,
          category: t.category,
          date: t.date,
          type: t.type,
        }));

      const financialContext = {
        name: userProfile?.name || undefined,
        monthlyIncome: userProfile?.monthly_income || undefined,
        currency: userProfile?.currency || '₹',
        categories: categoryData,
        totalSpent,
        totalBudget,
        recentTransactions,
      };

      // Determine if this is onboarding or general query
      const isOnboardingQuery = 
        !userProfile?.onboarding_completed ||
        text.toLowerCase().includes('onboard') ||
        text.toLowerCase().includes('get started') ||
        text.toLowerCase().includes('set up');

      let aiResponse;
      
      if (isOnboardingQuery && !userProfile?.onboarding_completed) {
        // Use onboarding flow for new users
        aiResponse = await guideOnboarding({ 
          userInput: text, 
          conversationHistory: history 
        });
      } else {
        // Use general financial assistant with full context
        aiResponse = await generalFinancialAssistant({
          userInput: text,
          conversationHistory: history,
          userContext: financialContext,
        });
      }

      const assistantResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse.response,
      };
      
      setMessages((prev) => [...prev, assistantResponse]);
      
      // Save assistant response to database
      await saveChatMessage("assistant", aiResponse.response);

      // Extract and save any new user preferences from the conversation
      if (text.toLowerCase().includes("rent") || text.toLowerCase().includes("salary") || 
          text.toLowerCase().includes("job") || text.toLowerCase().includes("income")) {
        const newContext = `${userContext}\n${new Date().toISOString()}: ${text}`;
        setUserContext(newContext);
        await updateUserPreferences({}, newContext);
      }

    } catch (error) {
        console.error("AI Error:", error);
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "Sorry, I couldn't get a response from the AI. Please check your API key and try again."
        });
        
        // Remove user message if AI fails
        setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      const result = await clearChatHistory();
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to clear chat history"
        });
      } else {
        setMessages([{
          id: "1",
          role: "assistant",
          content: "Chat history cleared. How can I help you today?",
        }]);
        toast({
          title: "Success",
          description: "Chat history cleared successfully"
        });
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">AI Assistant</h3>
        <Button variant="ghost" size="sm" onClick={handleClearHistory}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Bot className="h-8 w-8 text-primary animate-pulse" />
          </div>
        ) : (
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
        )}
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
