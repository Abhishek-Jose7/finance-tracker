import { SignUp } from '@clerk/nextjs';
import { Bot } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Branding */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            FinAI
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your AI-Powered Budgeting Ally
          </p>
        </div>

        {/* Sign Up Component */}
        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'bg-card shadow-xl',
              },
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            afterSignInUrl="/"
            afterSignUpUrl="/"
          />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Join thousands managing their finances smarter
        </p>
      </div>
    </div>
  );
}
