"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function FloatingAssistantButton() {
  const pathname = usePathname();

  if (pathname === "/assistant") {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          >
            <Link href="/assistant">
              <Bot className="h-7 w-7" />
              <span className="sr-only">Ask Assistant</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Ask Assistant</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
