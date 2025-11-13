"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";
import { mockAlerts } from "@/lib/data";
// import { provideOverspendingAlerts } from "@/ai/flows/provide-overspending-alerts";

export function AiAlerts() {
    // In a real app, you would fetch these from your backend/AI service
    // const [alerts, setAlerts] = useState([]);
    // useEffect(() => {
    //   const fetchAlerts = async () => {
    //     const result = await provideOverspendingAlerts({ ... });
    //     // transform result and set alerts
    //   }
    //   fetchAlerts();
    // }, []);

  return (
    <div>
        <h2 className="text-xl font-semibold mb-4">AI Alerts</h2>
        <div className="space-y-4">
        {mockAlerts.map((alert) => (
            <Alert key={alert.id} variant={alert.title.includes('Warning') ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>
                    {alert.description}
                </AlertDescription>
            </Alert>
        ))}
        {mockAlerts.length === 0 && (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>All Clear!</AlertTitle>
                <AlertDescription>
                    No new alerts at the moment. Your budget is on track.
                </AlertDescription>
            </Alert>
        )}
        </div>
    </div>
  );
}
