# Sample Data for Supabase Import

This directory contains sample CSV files that can be directly imported into your Supabase database for testing FinAI.

## 📋 Files Included

### 1. `users.csv`
**3 sample users** with complete profile information including monthly income, currency, occupation, and onboarding status.

**Columns**: id, clerk_user_id, email, name, avatar_url, monthly_income, currency, salary_day, occupation, onboarding_completed, phone, date_of_birth, created_at, updated_at

### 2. `categories.csv`
**12 category records** (8 for User 1, 4 for User 2) representing budget categories like Groceries, Rent, Entertainment, etc.

**Columns**: id, user_id, name, budget_limit, color, icon, created_by_user, created_at, updated_at

### 3. `transactions.csv`
**16 sample transactions** for November 2025, including salary income, grocery expenses, rent payments, dining, entertainment, etc.

**Columns**: id, user_id, amount, category, description, date, type, merchant, needs_user_confirmation, ml_confidence, ml_suggested_categories, created_at, updated_at

### 4. `chat_messages.csv`
**6 chat messages** showing sample AI assistant conversations about budget analysis and spending advice.

**Columns**: id, user_id, role, content, created_at

### 5. `uploaded_files.csv`
**3 file upload records** showing completed CSV/PDF imports with transaction counts.

**Columns**: id, user_id, file_name, file_type, file_size, processing_status, transactions_imported, error_message, created_at, updated_at

### 6. `user_preferences.csv`
**3 user preference records** with theme, language, and notification settings.

**Columns**: id, user_id, theme, language, notifications_enabled, ai_insights_enabled, auto_categorization_enabled, created_at, updated_at

---

## 🚀 How to Import

### Method 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Navigate to "Table Editor" in the left sidebar

2. **Import Each Table**
   - Click on the table name (e.g., `users`)
   - Click the "Insert" button → "Import data from CSV"
   - Upload the corresponding CSV file
   - Verify column mapping (should auto-detect)
   - Click "Import"

3. **Import Order** (Important - due to foreign keys):
   ```
   1. users.csv           (no dependencies)
   2. categories.csv      (depends on users)
   3. transactions.csv    (depends on users)
   4. chat_messages.csv   (depends on users)
   5. uploaded_files.csv  (depends on users)
   6. user_preferences.csv (depends on users)
   ```

### Method 2: SQL Import

Alternatively, you can convert the CSVs to SQL INSERT statements:

```sql
-- Example for users table
COPY users (id, clerk_user_id, email, name, avatar_url, monthly_income, currency, salary_day, occupation, onboarding_completed, phone, date_of_birth, created_at, updated_at)
FROM '/path/to/users.csv'
DELIMITER ','
CSV HEADER;
```

---

## 📊 Sample Data Details

### User 1: John Doe
- **Income**: ₹75,000/month
- **Occupation**: Software Engineer
- **Transactions**: 10 transactions (Nov 2025)
- **Total Expenses**: ₹32,650
- **Budgets**: All 8 default categories configured

**Spending Breakdown**:
- Rent: ₹15,000 (100% of budget)
- Groceries: ₹7,700 (128% of budget) ⚠️
- Shopping: ₹2,500 (83% of budget)
- Healthcare: ₹1,800 (72% of budget)
- Education: ₹1,500 (75% of budget)
- Dining: ₹1,500 (38% of budget)
- Entertainment: ₹1,200 (40% of budget)
- Transportation: ₹450 (23% of budget)

### User 2: Jane Smith
- **Income**: ₹65,000/month
- **Occupation**: Product Manager
- **Transactions**: 5 transactions (Nov 2025)
- **Total Expenses**: ₹18,950
- **Budgets**: 4 categories configured

**Spending Breakdown**:
- Rent: ₹12,000 (100% of budget)
- Groceries: ₹3,800 (69% of budget)
- Entertainment: ₹2,200 (55% of budget)
- Dining: ₹950 (27% of budget)

### User 3: Alex Kumar
- **Income**: ₹50,000/month
- **Occupation**: Marketing Specialist
- **Transactions**: 0 (newly created)
- **Budgets**: Not yet configured

---

## 🔧 Customization

### Modifying Sample Data

To create your own sample data:

1. **Copy an existing CSV** as a template
2. **Modify values** while maintaining:
   - UUID format for `id` fields
   - Foreign key relationships (user_id matches users.id)
   - Date format: `YYYY-MM-DD HH:MM:SS+00` for timestamps
   - Date format: `YYYY-MM-DD` for date fields
   - Type constraints (e.g., type must be 'income' or 'expense')

3. **Generate UUIDs** online: https://www.uuidgenerator.net/version4

4. **Ensure Referential Integrity**:
   - `categories.user_id` must exist in `users.id`
   - `transactions.user_id` must exist in `users.id`
   - `chat_messages.user_id` must exist in `users.id`

---

## ⚠️ Important Notes

### Clerk User IDs
The `clerk_user_id` values in the sample data are **placeholders** (`user_sample_001`, etc.). These will NOT match actual Clerk authentication users.

**For Production Use**:
1. Create actual users via Clerk sign-up
2. Their `clerk_user_id` will be automatically synced to Supabase
3. Use the real Supabase `users.id` (UUID) for linking transactions/categories

### UUID Conflicts
If you already have data in your tables, the sample UUIDs might conflict. To avoid this:
- Generate new UUIDs for all records
- Maintain consistency across foreign key relationships
- Or let Supabase auto-generate UUIDs by omitting the `id` column during import

### Timestamps
All timestamps use UTC timezone (`+00`). Adjust if needed for your local timezone.

---

## 🧪 Testing Scenarios

Use this sample data to test:

### Budget Tracking
- ✅ User 1 is **over budget** in Groceries (128%)
- ✅ User 2 is **on track** in all categories
- ✅ Test budget warnings and alerts

### Expense Trends
- ✅ Multiple transactions over 14 days (Nov 1-14, 2025)
- ✅ Mix of income and expenses
- ✅ Various categories and amounts

### AI Chat
- ✅ Pre-loaded conversation history
- ✅ Context-aware responses about user spending
- ✅ Budget analysis and recommendations

### File Uploads
- ✅ Historical upload records
- ✅ Different file types (CSV, PDF, XLSX)
- ✅ Processing status tracking

---

## 📝 Verification Queries

After importing, run these in Supabase SQL Editor to verify:

```sql
-- Check user count
SELECT COUNT(*) FROM users;
-- Expected: 3

-- Check categories per user
SELECT u.name, COUNT(c.id) as category_count
FROM users u
LEFT JOIN categories c ON c.user_id = u.id
GROUP BY u.name;
-- Expected: John Doe: 8, Jane Smith: 4, Alex Kumar: 0

-- Check transactions per user
SELECT u.name, COUNT(t.id) as transaction_count, SUM(t.amount) as total_amount
FROM users u
LEFT JOIN transactions t ON t.user_id = u.id
GROUP BY u.name;
-- Expected: John Doe: 10 transactions, Jane Smith: 5 transactions

-- Check budget vs spending for John Doe
SELECT 
  c.name,
  c.budget_limit,
  COALESCE(SUM(t.amount), 0) as spent,
  ROUND((COALESCE(SUM(t.amount), 0) / c.budget_limit * 100), 2) as percentage
FROM categories c
LEFT JOIN transactions t ON t.category = c.name AND t.type = 'expense' AND t.user_id = c.user_id
WHERE c.user_id = '550e8400-e29b-41d4-a716-446655440000'
GROUP BY c.name, c.budget_limit
ORDER BY percentage DESC;
-- Should show Groceries at 128%
```

---

## 🎯 Next Steps

After importing sample data:

1. **Sign in with Clerk** - Create a real user account
2. **Complete Onboarding** - Set up your profile and budgets
3. **Add Transactions** - Manually or via file upload
4. **Test AI Assistant** - Ask questions about your spending
5. **Explore Dashboard** - View charts, budgets, and insights

---

## 📚 Additional Resources

- **Main Documentation**: See `SYSTEM_DOCUMENTATION.md`
- **Database Schema**: See `supabase-schema.sql`
- **Supabase Import Guide**: https://supabase.com/docs/guides/database/import-data

---

**Happy Testing! 🚀**
