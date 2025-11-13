"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { mockRecommendations } from "@/lib/data";
// import { generateAiRecommendations } from "@/ai/flows/generate-ai-recommendations";

export function AiRecommendationCards() {
    // In a real app, you would fetch these from your backend/AI service
    // const [recommendations, setRecommendations] = useState([]);
    // useEffect(() => {
    //   const fetchRecs = async () => {
    //     const result = await generateAiRecommendations({ ... });
    //     // transform result and set recommendations
    //   }
    //   fetchRecs();
    // }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {mockRecommendations.map((rec) => (
          <Card key={rec.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                {rec.title}
              </CardTitle>
              <CardDescription>{rec.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button>Apply</Button>
              <Button variant="ghost">Dismiss</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
