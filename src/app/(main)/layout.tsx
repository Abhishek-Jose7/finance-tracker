"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { FloatingAssistantButton } from "@/components/layout/FloatingAssistantButton";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { EnhancedProfileOnboarding } from "@/components/onboarding/EnhancedProfileOnboarding";
import { useUser } from "@clerk/nextjs";

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { userProfile, isLoading } = useAppContext();
  const { isSignedIn } = useUser();

  // Show onboarding if user is signed in but hasn't completed profile
  if (isSignedIn && !isLoading && userProfile && !userProfile.onboarding_completed) {
    return <EnhancedProfileOnboarding />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-col w-full">
          <Header />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <FloatingAssistantButton />
    </SidebarProvider>
  );
}

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </AppProvider>
  );
}
