import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import ClerkClientProvider from '@/components/ClerkClientProvider';

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
    <ClerkClientProvider>
      <html lang="en" className="dark">
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkClientProvider>
  );
}
