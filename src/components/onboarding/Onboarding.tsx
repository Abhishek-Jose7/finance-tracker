"use client";

import { ChatInterface } from "@/components/assistant/ChatInterface";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/lib/types";

const onboardingMessages: ChatMessage[] = [
    {
        id: 'onboarding-1',
        role: 'assistant',
        content: "Welcome to FinAI! Let's get your finances set up. First, what is your monthly income?"
    }
];

export function Onboarding({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="fixed inset-0 bg-background/90 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="w-full max-w-2xl h-[80vh] bg-card border rounded-lg shadow-2xl flex flex-col">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">Welcome to FinAI</h2>
                <p className="text-muted-foreground">Let's set up your financial profile.</p>
            </div>
            <div className="flex-1 overflow-hidden">
                <ChatInterface initialMessages={onboardingMessages} />
            </div>
            <div className="p-4 border-t text-right">
                <Button onClick={onFinish}>Finish Onboarding</Button>
            </div>
        </div>
    </div>
  );
}
