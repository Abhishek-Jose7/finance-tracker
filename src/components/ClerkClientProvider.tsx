"use client";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

export default function ClerkClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        layout: { socialButtonsVariant: "iconButton" },
        variables: {
          colorPrimary: "#3bb5da",
          colorBackground: "#0f172a",
          colorInputBackground: "#1e293b",
          colorInputText: "#f1f5f9",
          colorText: "#f1f5f9",
          colorTextSecondary: "#94a3b8",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
