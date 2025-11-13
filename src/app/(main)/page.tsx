"use client";

import { useState, useEffect } from "react";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem("onboardingComplete") === "true";
    setIsOnboardingComplete(completed);
  }, []);

  const handleOnboardingFinish = () => {
    localStorage.setItem("onboardingComplete", "true");
    setIsOnboardingComplete(true);
  };

  if (isOnboardingComplete === null) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (!isOnboardingComplete) {
    return <Onboarding onFinish={handleOnboardingFinish} />;
  }

  return <Dashboard />;
}
