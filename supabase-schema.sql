-- FinAI Database Schema for Supabase
-- Run these commands in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
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

-- Create categories table
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update updated_at automatically
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

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own data"
    ON users FOR UPDATE
    USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own data"
    ON users FOR INSERT
    WITH CHECK (clerk_user_id = auth.jwt() ->> 'sub');

-- Create RLS policies for transactions table
CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can insert their own transactions"
    ON transactions FOR INSERT
    WITH CHECK (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can update their own transactions"
    ON transactions FOR UPDATE
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can delete their own transactions"
    ON transactions FOR DELETE
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

-- Create RLS policies for categories table
CREATE POLICY "Users can view their own categories"
    ON categories FOR SELECT
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can insert their own categories"
    ON categories FOR INSERT
    WITH CHECK (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can update their own categories"
    ON categories FOR UPDATE
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

CREATE POLICY "Users can delete their own categories"
    ON categories FOR DELETE
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create a function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_clerk_id TEXT)
RETURNS TABLE (
    total_income NUMERIC,
    total_expenses NUMERIC,
    transaction_count BIGINT,
    category_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expenses,
        COUNT(t.id) as transaction_count,
        (SELECT COUNT(*) FROM categories c WHERE c.user_id = u.id) as category_count
    FROM users u
    LEFT JOIN transactions t ON t.user_id = u.id
    WHERE u.clerk_user_id = user_clerk_id
    GROUP BY u.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for testing (optional - remove in production)
-- Uncomment the lines below to add sample data

/*
-- Insert a sample user
INSERT INTO users (clerk_user_id, email, name, avatar_url)
VALUES ('sample_clerk_id', 'test@example.com', 'Test User', 'https://example.com/avatar.jpg');

-- Get the user id
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    SELECT id INTO sample_user_id FROM users WHERE clerk_user_id = 'sample_clerk_id';
    
    -- Insert sample categories
    INSERT INTO categories (user_id, name, budget_limit, color, icon) VALUES
        (sample_user_id, 'Groceries', 600, '#10b981', 'ShoppingCart'),
        (sample_user_id, 'Entertainment', 300, '#8b5cf6', 'Film'),
        (sample_user_id, 'Rent', 1500, '#f59e0b', 'Home'),
        (sample_user_id, 'Dining', 400, '#ef4444', 'UtensilsCrossed');
    
    -- Insert sample transactions
    INSERT INTO transactions (user_id, amount, category, description, date, type) VALUES
        (sample_user_id, 150.00, 'Groceries', 'Weekly shopping', '2025-11-10', 'expense'),
        (sample_user_id, 50.00, 'Dining', 'Lunch with friends', '2025-11-11', 'expense'),
        (sample_user_id, 3000.00, 'Salary', 'Monthly salary', '2025-11-01', 'income');
END $$;
*/

-- Verification queries (run these to check your setup)
-- SELECT * FROM users;
-- SELECT * FROM categories;
-- SELECT * FROM transactions;
-- SELECT * FROM get_user_stats('your_clerk_user_id');
