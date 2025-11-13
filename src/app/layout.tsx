import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'FinAI: Your AI Budgeting Ally',
  description: 'AI-powered budgeting assistant to manage your finances.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsVariant: 'iconButton',
        },
        variables: {
          colorPrimary: '#3bb5da',
          colorBackground: '#0f172a',
          colorInputBackground: '#1e293b',
          colorInputText: '#f1f5f9',
          colorText: '#f1f5f9',
          colorTextSecondary: '#94a3b8',
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
