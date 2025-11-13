import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/assistant/ChatInterface";

export default function AssistantPage() {
  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <ChatInterface />
      </CardContent>
    </Card>
  );
}
