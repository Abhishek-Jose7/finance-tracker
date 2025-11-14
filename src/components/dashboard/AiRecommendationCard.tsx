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
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">AI Recommendations</h2>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {mockRecommendations.map((rec) => (
          <Card key={rec.id} className="flex flex-col">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                {rec.title}
              </CardTitle>
              <CardDescription className="text-sm">{rec.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto gap-2 p-4 sm:p-6">
              <Button size="sm" className="text-sm">Apply</Button>
              <Button variant="ghost" size="sm" className="text-sm">Dismiss</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
