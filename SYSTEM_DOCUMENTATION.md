# FinAI - System Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Features & Functionality](#features--functionality)
5. [User Flow](#user-flow)
6. [API Integration](#api-integration)
7. [File Upload & Processing](#file-upload--processing)
8. [Sample Data](#sample-data)
9. [Deployment](#deployment)

---

## 🎯 Overview

**FinAI** is an AI-powered personal finance tracking application built with Next.js 15, React 19, and Supabase. It helps users manage their finances through intelligent categorization, budget tracking, and conversational AI assistance.

### Tech Stack
- **Frontend**: Next.js 15.0.3 (App Router), React 19.0.0, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Clerk 6.7.2
- **Database**: Supabase (PostgreSQL)
- **AI/ML**: 
  - HuggingFace BART-large-MNLI (transaction categorization)
  - Google Genkit (AI assistant flows)
- **Deployment**: Vercel

### Default Settings
- **Currency**: INR (₹) - Indian Rupees
- **Budget Categories**: 8 default categories with INR-appropriate limits
- **ML Confidence Threshold**: 50% for auto-categorization

---

## 🏗️ Architecture

### Application Structure
```
src/
├── app/                      # Next.js App Router
│   ├── (main)/              # Authenticated routes
│   │   ├── dashboard/       # Main dashboard
│   │   ├── transactions/    # Transaction management
│   │   ├── budget/          # Budget planner
│   │   ├── assistant/       # AI chatbot
│   │   └── settings/        # User settings
│   ├── sign-in/             # Clerk sign-in
│   └── sign-up/             # Clerk sign-up
├── components/              # React components
│   ├── dashboard/           # Dashboard widgets
│   ├── transactions/        # Transaction UI
│   ├── budget/              # Budget components
│   ├── assistant/           # Chat interface
│   ├── onboarding/          # Profile setup
│   ├── layout/              # Header, sidebar, nav
│   └── ui/                  # shadcn/ui components
├── context/
│   └── AppContext.tsx       # Global state management
├── lib/
│   ├── db-actions.ts        # Supabase server actions
│   ├── file-processing.ts   # CSV/JSON/HTML parsing
│   ├── supabase.ts          # Supabase client
│   └── types.ts             # TypeScript types
└── ai/
    └── flows/               # Genkit AI flows
```

### Data Flow
1. **User Authentication**: Clerk → Supabase user sync
2. **Data Fetching**: AppContext → db-actions → Supabase
3. **Transactions**: User input → createTransaction → Database → UI refresh
4. **File Upload**: CSV/JSON → parseTransactions → ML categorization → Database
5. **AI Chat**: User message → Genkit flow → AI response → Chat history

---

## 🗄️ Database Schema

### Core Tables

#### 1. **users**
Stores user profile and preferences.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `clerk_user_id` | TEXT | Clerk authentication ID (unique) |
| `email` | TEXT | User email |
| `name` | TEXT | User full name |
| `avatar_url` | TEXT | Profile picture URL |
| `monthly_income` | NUMERIC | Monthly income amount |
| `currency` | TEXT | Currency code (INR, USD, EUR, GBP) |
| `salary_day` | INTEGER | Day of month salary is received |
| `occupation` | TEXT | User's occupation |
| `onboarding_completed` | BOOLEAN | Whether onboarding is done |
| `phone` | TEXT | Phone number |
| `date_of_birth` | DATE | Date of birth |
| `created_at` | TIMESTAMPTZ | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

#### 2. **categories**
Budget categories for expense tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key → users.id |
| `name` | TEXT | Category name (Groceries, Rent, etc.) |
| `budget_limit` | NUMERIC | Monthly budget limit |
| `color` | TEXT | Hex color code for UI |
| `icon` | TEXT | Icon name (Lucide icon) |
| `created_by_user` | BOOLEAN | Whether user created (vs default) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Default Categories**:
- Groceries (₹6,000) - #10b981 - ShoppingCart
- Entertainment (₹3,000) - #8b5cf6 - Film
- Rent (₹15,000) - #f59e0b - Home
- Dining (₹4,000) - #ef4444 - UtensilsCrossed
- Transportation (₹2,000) - #3b82f6 - Car
- Shopping (₹3,000) - #ec4899 - Shirt
- Healthcare (₹2,500) - #14b8a6 - HeartPulse
- Education (₹2,000) - #f97316 - BookOpen

#### 3. **transactions**
All income and expense transactions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key → users.id |
| `amount` | NUMERIC | Transaction amount |
| `category` | TEXT | Category name |
| `description` | TEXT | Transaction description |
| `date` | DATE | Transaction date |
| `type` | TEXT | 'income' or 'expense' |
| `merchant` | TEXT | Merchant/vendor name |
| `needs_user_confirmation` | BOOLEAN | ML categorization needs review |
| `ml_confidence` | NUMERIC | ML model confidence (0-1) |
| `ml_suggested_categories` | JSONB | Alternative category suggestions |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

#### 4. **chat_messages**
AI assistant conversation history.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key → users.id |
| `role` | TEXT | 'user' or 'assistant' |
| `content` | TEXT | Message content |
| `created_at` | TIMESTAMPTZ | Message timestamp |

#### 5. **uploaded_files**
Tracking for uploaded bank statements/CSVs.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key → users.id |
| `file_name` | TEXT | Original filename |
| `file_type` | TEXT | MIME type |
| `file_size` | INTEGER | File size in bytes |
| `processing_status` | TEXT | 'processing', 'completed', 'failed' |
| `transactions_imported` | INTEGER | Number of transactions imported |
| `error_message` | TEXT | Error details if failed |
| `created_at` | TIMESTAMPTZ | Upload timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

#### 6. **user_preferences**
User settings and preferences.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key → users.id |
| `theme` | TEXT | 'light' or 'dark' |
| `language` | TEXT | Language code (en, es, fr) |
| `notifications_enabled` | BOOLEAN | Push notifications |
| `ai_insights_enabled` | BOOLEAN | AI recommendations |
| `auto_categorization_enabled` | BOOLEAN | ML auto-categorization |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### Relationships
```
users (1) ──→ (N) categories
users (1) ──→ (N) transactions
users (1) ──→ (N) chat_messages
users (1) ──→ (N) uploaded_files
users (1) ──→ (1) user_preferences
```

### Indexes
- `idx_users_clerk_id` on `users(clerk_user_id)`
- `idx_users_onboarding` on `users(onboarding_completed)`
- `idx_transactions_user_id` on `transactions(user_id)`
- `idx_transactions_date` on `transactions(date)`
- `idx_transactions_category` on `transactions(category)`
- `idx_categories_user_id` on `categories(user_id)`

---

## ✨ Features & Functionality

### 1. **Authentication** (Clerk)
- Sign up with email/password
- Social login (Google, GitHub)
- Session management
- Protected routes via middleware
- User profile sync to Supabase

### 2. **Onboarding Flow** (EnhancedProfileOnboarding)
**4-Step Wizard**:
1. **Financial Info**: Monthly income, currency, salary day
2. **Professional Info**: Occupation, employment details
3. **Budget Setup**: Set monthly limits for 8 categories
4. **Personal Info** (Optional): Phone, date of birth

**Implementation**:
- Saves to database via `completeUserOnboarding()`
- Creates categories via `createUserBudgets()`
- Hard refresh to `/dashboard` after completion
- Only shown to users with `onboarding_completed = false`

### 3. **Dashboard** (Dashboard Component)
Displays:
- **Total Budget**: Sum of all category limits
- **Total Spent**: Sum of all expenses this month
- **Category Progress**: Visual bars showing spent/budget ratio
- **AI Recommendations**: Budget adjustment suggestions
- **Spending Prediction**: ML-based overspending alerts
- **Recent Transactions**: Last 5 transactions

**Calculations**:
- Budget percentage: `(totalSpent / totalBudget) × 100`
- Category spent: Filtered sum of transactions by category
- Colors: Green (<80%), Yellow (80-100%), Red (>100%)

### 4. **Transactions Management**
**Features**:
- View all transactions in sortable table
- Filter by category, date range, type (income/expense)
- Add transactions manually via dialog
- Upload bank statements (CSV, JSON, HTML)
- Edit/delete transactions
- ML-based categorization with confidence scores

**Add Transaction Dialog** (Header.tsx):
- Type: Income/Expense dropdown
- Description: Text input
- Amount: Number input
- Category: Dropdown (populated from user's categories)
- Date: Date picker
- Saves to database via `addTransaction()`
- Calls `refreshData()` to update all views

**File Upload** (FileUploadZone.tsx):
- Drag & drop or click to upload
- Supported formats: CSV, JSON, HTML, XLSX
- Parses multiple column name variations
- Handles quoted values and commas in CSV
- ML categorizes each transaction
- Shows confirmation dialog for low-confidence (<50%) categorizations

**Parsing Logic** (file-processing.ts):
- **CSV**: Handles quoted values, multiple delimiters
- **JSON**: Flexible structure detection
- **HTML**: Extracts tables using pattern matching
- **Column Detection**: 
  - Amount: `amount`, `debit`, `credit`, `withdrawal`, `deposit`, `amt`, `value`
  - Description: `description`, `merchant`, `details`, `particulars`, `narration`
  - Date: `date`, `transaction_date`, `posted_date`, `txn_date`

### 5. **Budget Planner** (BudgetPlanner & BudgetManagement)
**Budget Overview**:
- Total monthly budget display
- Budget percentage of income
- Individual category cards with:
  - Category icon and color
  - Budget limit input (editable)
  - Current spent amount
  - Progress bar (green/yellow/red)
  - Percentage indicator

**Budget Editing**:
- Edit budget limits for each category
- Real-time total budget calculation
- Warning if budget exceeds income
- Saves to database via `updateCategory()`

**Empty State**:
- Shows message if no categories exist
- Prompts to complete onboarding

### 6. **AI Assistant** (ChatInterface)
**Capabilities**:
- Conversational finance queries
- Budget analysis and recommendations
- Spending pattern insights
- Overspending alerts
- Savings suggestions
- Goal tracking advice

**Implementation** (Genkit Flows):
1. `analyze-budget-suggest-adjustments.ts`: Budget optimization
2. `explain-transaction-details.ts`: Transaction explanations
3. `generate-ai-recommendations.ts`: Personalized advice
4. `guide-onboarding-conversationally.ts`: Onboarding help
5. `provide-overspending-alerts.ts`: Alert generation

**Chat Features**:
- Message history stored in `chat_messages` table
- Context-aware responses (uses user's transaction data)
- Real-time typing indicators
- Message timestamps
- Conversation persistence

### 7. **Settings** (Settings Page)
**Sections**:
- **Personal Information**: Name, email, phone
- **Appearance**: Theme (light/dark/system)
- **Localization**: Currency, language
- **AI Settings**: Intensity, auto-budget, predictions
- **Notifications**: Daily summary, alerts, silent hours
- **Data Sources**: SMS parsing, file uploads
- **Security**: App lock, delete account

**Account Deletion**:
- Confirmation dialog with warnings
- Deletes ALL user data:
  - Transactions
  - Categories
  - Chat history
  - Uploaded files
  - Preferences
  - User record
- Signs out from Clerk
- Redirects to home page

### 8. **ML Categorization** (HuggingFace Integration)
**Model**: `facebook/bart-large-mnli` (zero-shot classification)

**Process**:
1. User uploads transaction file
2. Each transaction description sent to model
3. Model returns confidence scores for each category
4. If confidence > 50%: Auto-categorize
5. If confidence ≤ 50%: Show confirmation dialog
6. User can accept or choose alternative category

**Example**:
```
Description: "Paid for groceries at BigBasket"
Model Output:
- Groceries: 85% ✓ (auto-categorized)
- Dining: 8%
- Shopping: 5%
```

---

## 👤 User Flow

### New User Journey
1. **Sign Up** → Clerk authentication
2. **User Sync** → Creates record in Supabase `users` table
3. **Onboarding** → 4-step wizard appears
   - Set financial info (income, currency)
   - Set occupation
   - Configure budget limits for 8 categories
   - Optional personal details
4. **Dashboard** → Redirected to main app
5. **Add Transactions** → Manually or via file upload
6. **Monitor Budget** → View spending vs limits
7. **AI Assistance** → Chat for insights and advice

### Returning User Journey
1. **Sign In** → Clerk authentication
2. **Dashboard** → Immediately see latest data
3. **View Transactions** → Check recent activity
4. **Upload Files** → Import bank statements
5. **Check Budget** → Monitor category spending
6. **Settings** → Adjust preferences

### Data Flow Example
```
User clicks "Add Expense"
    ↓
Header.tsx: Shows dialog with form
    ↓
User fills: Amount=1000, Category=Groceries, Description="Weekly shopping"
    ↓
handleAddExpense() calls addTransaction()
    ↓
AppContext.addTransaction() → db-actions.createTransaction()
    ↓
Supabase: INSERT INTO transactions
    ↓
refreshData() called
    ↓
UI updates: Dashboard, Transactions, Budget all refresh
    ↓
Category spent recalculated: Groceries spent increased by ₹1000
```

---

## 🔌 API Integration

### Supabase Client (lib/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Database Actions (lib/db-actions.ts)
**Key Functions**:
- `syncUserToDatabase()`: Creates/updates user from Clerk
- `createDefaultCategories()`: Creates 8 default categories
- `getUserTransactions()`: Fetches user's transactions
- `getUserCategories()`: Fetches user's categories
- `createTransaction()`: Adds new transaction
- `updateCategory()`: Updates category budget
- `updateTransactionCategory()`: Changes transaction category
- `completeUserOnboarding()`: Saves onboarding data
- `deleteUserAccount()`: Deletes all user data

### HuggingFace API
**Endpoint**: `https://api-inference.huggingface.co/models/facebook/bart-large-mnli`

**Request**:
```json
{
  "inputs": "Grocery shopping at BigBasket",
  "parameters": {
    "candidate_labels": ["Groceries", "Entertainment", "Rent", ...]
  }
}
```

**Response**:
```json
{
  "sequence": "Grocery shopping at BigBasket",
  "labels": ["Groceries", "Dining", "Shopping"],
  "scores": [0.85, 0.08, 0.05]
}
```

---

## 📂 File Upload & Processing

### Supported Formats
1. **CSV** (text/csv)
2. **JSON** (application/json)
3. **HTML** (text/html)
4. **Excel** (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)

### CSV Parsing Features
- **Quoted Value Handling**: Handles commas inside quotes
- **Multiple Delimiters**: Comma, semicolon, tab
- **Column Variations**: Detects 20+ column name variations
- **Date Parsing**: Multiple date formats (DD/MM/YYYY, YYYY-MM-DD, etc.)
- **Amount Detection**: Handles debit/credit columns separately

### HTML Parsing
- Extracts `<table>` elements
- Detects header row automatically
- Handles rowspan/colspan
- Bank statement pattern recognition

### Processing Flow
```
1. User uploads file → FileUploadZone.tsx
2. File validated (size, type)
3. File content read as text/base64
4. processUploadedFile() called
5. Record created in uploaded_files table (status: processing)
6. parseTransactions() called based on file type
7. Each transaction sent to ML categorization
8. If confidence > 50%: Auto-save
9. If confidence ≤ 50%: Show CategoryConfirmationDialog
10. User confirms/changes category
11. Transactions saved to database
12. uploaded_files status updated to 'completed'
13. Dashboard refreshes with new data
```

---

## 📊 Sample Data

Sample CSV files are provided in `sample-data/` directory for testing:

### Files Included
1. **users.csv** - 3 sample users with complete profiles
2. **categories.csv** - Default categories for sample users
3. **transactions.csv** - 16 sample transactions (Nov 2025)
4. **chat_messages.csv** - 6 sample AI chat conversations
5. **uploaded_files.csv** - 3 sample file upload records
6. **user_preferences.csv** - User settings for 3 users

### How to Import
1. Open Supabase Dashboard
2. Go to Table Editor
3. Select table (e.g., `users`)
4. Click "Insert" → "Import data from CSV"
5. Upload corresponding CSV file
6. Map columns (should auto-match)
7. Click "Import"
8. Repeat for each table

### Sample User Credentials
**Note**: These are Supabase records only. For Clerk authentication, create actual user accounts.

**User 1**:
- Name: John Doe
- Email: john.doe@example.com
- Income: ₹75,000/month
- Occupation: Software Engineer

**User 2**:
- Name: Jane Smith
- Email: jane.smith@example.com
- Income: ₹65,000/month
- Occupation: Product Manager

---

## 🚀 Deployment

### Environment Variables
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# HuggingFace
HUGGINGFACE_API_KEY=hf_...

# Google Genkit (Optional)
GOOGLE_API_KEY=AIza...
```

### Vercel Deployment
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push to `main`
4. Custom domain configuration (optional)

### Build Command
```bash
npm run build
```

### Database Setup
1. Run `supabase-schema.sql` in Supabase SQL Editor
2. Run `supabase-profile-update.sql` for user profile fields
3. Run `supabase-chat-history.sql` for chat functionality
4. Run `supabase-ml-upload.sql` for file upload tracking
5. Import sample data CSV files (optional)

---

## 🔐 Security

### Authentication
- Clerk handles all auth logic
- JWT tokens for API calls
- Automatic session management
- Protected routes via middleware

### Row Level Security (RLS)
All Supabase tables have RLS enabled:
- Users can only access their own data
- Policies check `clerk_user_id` matches JWT
- Prevents data leaks between users

### Data Privacy
- Passwords never stored (Clerk manages)
- Transactions encrypted at rest
- HTTPS only in production
- No third-party analytics tracking financial data

---

## 📝 Key Concepts

### AppContext (Global State)
- Manages transactions, categories, user profile
- Loads data on authentication
- Provides CRUD functions to all components
- Automatically calculates category spending
- Refreshes data after mutations

### Server Actions
- All database operations are server-side
- Prevents exposing API keys to client
- Type-safe with TypeScript
- Error handling and logging

### Client Components
- All UI components are client-side (`"use client"`)
- Use hooks (useState, useEffect, useContext)
- Server actions called from client
- Next.js handles data fetching optimization

---

## 🐛 Troubleshooting

### Categories Not Showing
**Issue**: Budget Management shows ₹0 with no categories

**Solution**:
1. Check browser console for logs
2. Verify onboarding was completed: `onboarding_completed = true`
3. Check Supabase `categories` table has records
4. Force refresh: Ctrl+Shift+R or sign out and back in
5. Run in console: `localStorage.clear()` then refresh

### Transactions Not Saving
**Issue**: Add Transaction doesn't save to database

**Solution**:
1. Check console for errors
2. Verify Clerk user is synced: Check `users` table
3. Ensure category name matches exactly (case-sensitive)
4. Check Supabase logs in Dashboard → Logs → API
5. Verify `createTransaction()` function is not throwing errors

### File Upload Fails
**Issue**: CSV/JSON upload doesn't import transactions

**Solution**:
1. Check file format is valid CSV/JSON
2. Verify column names match expected variations
3. Check console for parsing errors
4. Test with sample CSV first
5. Ensure ML API (HuggingFace) is accessible

---

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Clerk Docs**: https://clerk.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **HuggingFace Models**: https://huggingface.co/models

---

## 🎉 Conclusion

FinAI provides a comprehensive personal finance management solution with:
- ✅ Secure authentication
- ✅ Intelligent transaction categorization
- ✅ Real-time budget tracking
- ✅ AI-powered insights
- ✅ Multi-format file import
- ✅ Mobile-responsive design
- ✅ Complete data privacy

All data is stored securely in Supabase with row-level security, and users maintain full control over their financial information.
