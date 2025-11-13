# API Reference

Documentation for FinAI's AI-powered features and internal APIs.

## Table of Contents
- [AI Flows](#ai-flows)
- [Context API](#context-api)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)

---

## AI Flows

All AI flows are located in `src/ai/flows/` and use Google Genkit with Gemini AI.

### Analyze Budget and Suggest Adjustments

**File:** `src/ai/flows/analyze-budget-suggest-adjustments.ts`

Analyzes user's budget and spending patterns to suggest adjustments.

#### Function Signature
```typescript
function analyzeBudgetAndSuggestAdjustments(
  input: AnalyzeBudgetAndSuggestAdjustmentsInput
): Promise<AnalyzeBudgetAndSuggestAdjustmentsOutput>
```

#### Input Schema
```typescript
{
  income: number              // Monthly income
  spendingPatterns: string    // Description of spending patterns
  overspendingRisk: boolean   // Whether user is at risk
  currentBudget: string       // Current budget details
}
```

#### Output Schema
```typescript
{
  analysis: string            // Budget analysis
  suggestedAdjustments: string // Recommended changes
  revisedBudget: string       // Updated budget
}
```

#### Example Usage
```typescript
import { analyzeBudgetAndSuggestAdjustments } from '@/ai/flows/analyze-budget-suggest-adjustments';

const result = await analyzeBudgetAndSuggestAdjustments({
  income: 5000,
  spendingPatterns: "Spending $800/mo on groceries, $400 on entertainment",
  overspendingRisk: true,
  currentBudget: "Groceries: $600, Entertainment: $300"
});

console.log(result.analysis);
console.log(result.suggestedAdjustments);
console.log(result.revisedBudget);
```

---

### Explain Transaction Details

**File:** `src/ai/flows/explain-transaction-details.ts`

Provides detailed explanations and insights about specific transactions.

#### Function Signature
```typescript
function explainTransactionDetails(
  input: ExplainTransactionDetailsInput
): Promise<ExplainTransactionDetailsOutput>
```

#### Input Schema
```typescript
{
  transactionAmount: number   // Transaction amount
  transactionCategory: string // Category name
  transactionDate: string     // Date of transaction
  userContext: string         // Additional context
}
```

#### Output Schema
```typescript
{
  explanation: string         // Detailed explanation
  impactOnBudget: string     // Budget impact analysis
  suggestions: string        // Future recommendations
}
```

#### Example Usage
```typescript
import { explainTransactionDetails } from '@/ai/flows/explain-transaction-details';

const result = await explainTransactionDetails({
  transactionAmount: 150,
  transactionCategory: "Dining",
  transactionDate: "2025-11-10",
  userContext: "Monthly dining budget is $200"
});

console.log(result.explanation);
console.log(result.impactOnBudget);
```

---

### Generate AI Recommendations

**File:** `src/ai/flows/generate-ai-recommendations.ts`

Generates personalized financial recommendations based on user data.

#### Function Signature
```typescript
function generateAiRecommendations(
  input: GenerateAiRecommendationsInput
): Promise<GenerateAiRecommendationsOutput>
```

#### Input Schema
```typescript
{
  userFinancialData: string   // User's financial information
  goals: string               // Financial goals
  preferences: string         // User preferences
}
```

#### Output Schema
```typescript
{
  recommendations: string     // List of recommendations
  priority: string           // Priority order
  actionItems: string        // Specific actions to take
}
```

#### Example Usage
```typescript
import { generateAiRecommendations } from '@/ai/flows/generate-ai-recommendations';

const result = await generateAiRecommendations({
  userFinancialData: "Income: $5000, Savings: $10000",
  goals: "Save for house down payment",
  preferences: "Low risk investments"
});
```

---

### Guide Onboarding Conversationally

**File:** `src/ai/flows/guide-onboarding-conversationally.ts`

Provides conversational guidance during user onboarding.

#### Function Signature
```typescript
function guideOnboardingConversationally(
  input: GuideOnboardingConversationallyInput
): Promise<GuideOnboardingConversationallyOutput>
```

#### Input Schema
```typescript
{
  userMessage: string         // User's message
  conversationHistory: string // Previous conversation
  onboardingStep: string     // Current step in onboarding
}
```

#### Output Schema
```typescript
{
  response: string           // AI response
  nextStep: string           // Next onboarding step
  completed: boolean         // Whether onboarding is done
}
```

---

### Provide Overspending Alerts

**File:** `src/ai/flows/provide-overspending-alerts.ts`

Analyzes spending to generate proactive overspending alerts.

#### Function Signature
```typescript
function provideOverspendingAlerts(
  input: ProvideOverspendingAlertsInput
): Promise<ProvideOverspendingAlertsOutput>
```

#### Input Schema
```typescript
{
  currentSpending: string     // Current spending data
  budgetLimits: string       // Budget constraints
  timeframe: string          // Analysis timeframe
}
```

#### Output Schema
```typescript
{
  alerts: string             // Generated alerts
  severity: string           // Alert severity level
  recommendations: string    // How to avoid overspending
}
```

---

## Context API

### AppContext

**File:** `src/context/AppContext.tsx`

Global state management for the application.

#### Provider Setup
```tsx
import { AppProvider } from '@/context/AppContext';

function App() {
  return (
    <AppProvider>
      <YourComponents />
    </AppProvider>
  );
}
```

#### Using the Context
```tsx
import { useAppContext } from '@/context/AppContext';

function YourComponent() {
  const { transactions, categories, addTransaction, updateCategory } = useAppContext();
  
  // Use context values and methods
}
```

#### Available Values

**transactions: Transaction[]**
- Array of all transactions
- Automatically updates UI when changed

**categories: Category[]**
- Array of budget categories
- Includes spent amounts and limits

**addTransaction(transaction: Omit<Transaction, 'id'>): void**
- Adds a new transaction
- Automatically updates category spent amounts

Example:
```tsx
addTransaction({
  amount: 50,
  category: 'Groceries',
  description: 'Weekly shopping',
  date: '2025-11-13',
  type: 'expense'
});
```

**updateCategory(categoryId: string, newValues: Partial<Category>): void**
- Updates a category's properties
- Partial update supported

Example:
```tsx
updateCategory('category-id', {
  budgetLimit: 500,
  color: '#FF5733'
});
```

---

## Utility Functions

### cn (Class Names)

**File:** `src/lib/utils.ts`

Merges Tailwind CSS classes intelligently.

```typescript
import { cn } from '@/lib/utils';

// Merge classes with conflict resolution
const className = cn(
  'px-4 py-2',
  'bg-blue-500',
  isActive && 'bg-green-500', // Overrides blue
  className
);
```

### formatCurrency

```typescript
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}
```

### formatDate

```typescript
function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
```

---

## Type Definitions

**File:** `src/lib/types.ts`

### Core Types

#### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

#### Transaction
```typescript
interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  merchant?: string;
}
```

#### Category
```typescript
interface Category {
  id: string;
  name: string;
  budgetLimit: number;
  spent: number;
  color: string;
  icon: LucideIcon;
}
```

#### Alert
```typescript
interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  date: string;
  category?: string;
}
```

#### Recommendation
```typescript
interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  potentialSavings?: number;
}
```

---

## Custom Hooks

### useToast

**File:** `src/hooks/use-toast.ts`

Display toast notifications.

```tsx
import { useToast } from '@/hooks/use-toast';

function YourComponent() {
  const { toast } = useToast();
  
  const showNotification = () => {
    toast({
      title: "Success!",
      description: "Transaction added successfully",
      variant: "default" // or "destructive"
    });
  };
  
  return <button onClick={showNotification}>Add</button>;
}
```

### useMobile

**File:** `src/hooks/use-mobile.tsx`

Detect mobile viewport.

```tsx
import { useMobile } from '@/hooks/use-mobile';

function ResponsiveComponent() {
  const isMobile = useMobile();
  
  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

---

## Data Access

### Mock Data

**File:** `src/lib/data.ts`

Provides mock data for development and demo purposes.

#### Available Exports

```typescript
import {
  mockUser,
  mockTransactions,
  mockCategories,
  mockAlerts,
  mockRecommendations,
  mockPredictionData
} from '@/lib/data';
```

#### Placeholder Images

**File:** `src/lib/placeholder-images.ts`

```typescript
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Access placeholder images
const image = PlaceHolderImages.userAvatar;
const icon = PlaceHolderImages.categoryIcon;
```

---

## Server Actions

All AI flows are server-side functions using Next.js Server Actions.

### Calling from Client Components

```tsx
'use client';

import { analyzeBudgetAndSuggestAdjustments } from '@/ai/flows/analyze-budget-suggest-adjustments';

function BudgetAnalysis() {
  const [loading, setLoading] = useState(false);
  
  const analyzebudget = async () => {
    setLoading(true);
    try {
      const result = await analyzeBudgetAndSuggestAdjustments({
        income: 5000,
        spendingPatterns: "...",
        overspendingRisk: true,
        currentBudget: "..."
      });
      
      console.log(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return <button onClick={analyzebudget}>Analyze</button>;
}
```

---

## Error Handling

### AI Flow Errors

```typescript
try {
  const result = await analyzeBudgetAndSuggestAdjustments(input);
} catch (error) {
  if (error instanceof Error) {
    // Handle API errors
    if (error.message.includes('API key')) {
      // Invalid API key
    } else if (error.message.includes('rate limit')) {
      // Rate limit exceeded
    }
  }
}
```

### Context Errors

```typescript
// Always use context within provider
try {
  const context = useAppContext();
} catch (error) {
  console.error('useAppContext must be used within AppProvider');
}
```

---

## Environment Variables

### Required Variables

```bash
# .env
GEMINI_API_KEY=your_api_key_here
```

### Accessing in Code

**Server-side (AI flows, Server Components):**
```typescript
const apiKey = process.env.GEMINI_API_KEY;
```

**Client-side (use NEXT_PUBLIC_ prefix):**
```typescript
const publicVar = process.env.NEXT_PUBLIC_API_URL;
```

---

## Best Practices

### 1. Type Safety
Always use TypeScript types from `@/lib/types`

### 2. Error Handling
Wrap AI calls in try-catch blocks

### 3. Loading States
Show loading indicators during AI operations

### 4. Caching
Consider caching repeated AI requests

### 5. Rate Limiting
Implement client-side rate limiting for AI calls

### 6. Validation
Validate inputs before sending to AI flows using Zod schemas

---

## Testing

### Testing AI Flows

```typescript
// Example test
import { analyzeBudgetAndSuggestAdjustments } from '@/ai/flows/analyze-budget-suggest-adjustments';

describe('analyzeBudgetAndSuggestAdjustments', () => {
  it('should return budget analysis', async () => {
    const result = await analyzeBudgetAndSuggestAdjustments({
      income: 5000,
      spendingPatterns: "Test patterns",
      overspendingRisk: true,
      currentBudget: "Test budget"
    });
    
    expect(result.analysis).toBeDefined();
    expect(result.suggestedAdjustments).toBeDefined();
  });
});
```

---

## Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [Genkit Documentation](https://firebase.google.com/docs/genkit)
- [Google Gemini API](https://ai.google.dev/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

For more information, see:
- `README.md` - Overview and getting started
- `DEPLOYMENT.md` - Deployment guides
- `TROUBLESHOOTING.md` - Common issues
- `CONTRIBUTING.md` - How to contribute
