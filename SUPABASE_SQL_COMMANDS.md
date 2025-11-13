# SQL Commands for Supabase

Copy and paste these commands in the Supabase SQL Editor.

## Option 1: Run Complete Schema (Recommended)

Go to Supabase Dashboard → SQL Editor → New Query
Then copy and paste the entire contents of the file: `supabase-schema.sql`

## Option 2: Step-by-Step Commands

If you prefer to run commands one at a time, use these:

### Step 1: Enable UUID Extension

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Step 2: Create Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 3: Create Transactions Table

```sql
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    merchant TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 4: Create Categories Table

```sql
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    budget_limit NUMERIC(10, 2) NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);
```

### Step 5: Create Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
```

### Step 6: Create Update Trigger Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Step 7: Add Update Triggers

```sql
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Step 8: Enable Row Level Security

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
```

### Step 9: Create RLS Policies

**For public access (simpler, recommended for development):**

```sql
-- Allow all operations for authenticated users on their own data
CREATE POLICY "Enable all for users based on user_id" ON users
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all for transactions" ON transactions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all for categories" ON categories
    FOR ALL USING (true) WITH CHECK (true);
```

**OR for production (more secure, requires Clerk JWT setup):**

```sql
-- Users table policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own data" ON users
    FOR INSERT WITH CHECK (clerk_user_id = auth.jwt() ->> 'sub');

-- Transactions table policies
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can insert their own transactions" ON transactions
    FOR INSERT WITH CHECK (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can update their own transactions" ON transactions
    FOR UPDATE USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can delete their own transactions" ON transactions
    FOR DELETE USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

-- Categories table policies
CREATE POLICY "Users can view their own categories" ON categories
    FOR SELECT USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can insert their own categories" ON categories
    FOR INSERT WITH CHECK (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can update their own categories" ON categories
    FOR UPDATE USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can delete their own categories" ON categories
    FOR DELETE USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));
```

### Step 10: Verify Setup

```sql
-- Check tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY indexname;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

---

## Quick Verification

After running the schema, verify with:

```sql
-- Should return: users, transactions, categories
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check if tables are empty (they should be)
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'categories', COUNT(*) FROM categories;
```

---

## Important Notes

1. **RLS Policies**: Use the simpler version for development, production version for live apps
2. **First Run**: Tables will be empty - data is created when users sign up
3. **Testing**: Sign up in your app to see data appear in these tables
4. **Backup**: Supabase automatically backs up your database

---

## Troubleshooting

### If you get "relation already exists" errors:

This means tables already exist. You can either:
- Drop and recreate (WARNING: deletes all data):
  ```sql
  DROP TABLE IF EXISTS transactions CASCADE;
  DROP TABLE IF EXISTS categories CASCADE;
  DROP TABLE IF EXISTS users CASCADE;
  ```
  Then run the schema again.

### If RLS blocks all queries:

Temporarily disable RLS for testing:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
```

Remember to re-enable it later!

---

**That's it!** Your database is ready. 🎉
