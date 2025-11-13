import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { FloatingAssistantButton } from "@/components/layout/FloatingAssistantButton";
import { AppProvider } from "@/context/AppContext";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
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
    </AppProvider>
  );
}
