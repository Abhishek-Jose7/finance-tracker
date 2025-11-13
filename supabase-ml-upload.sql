-- ============================================
-- Transaction Processing and ML Categorization System
-- ============================================
-- Run this AFTER supabase-profile-update.sql

-- Add budget categories to track user-defined budgets
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT FALSE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS created_by_user BOOLEAN DEFAULT FALSE;

-- Create uploaded_files table to track file uploads
CREATE TABLE IF NOT EXISTS uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'csv', 'pdf', 'image', 'json'
  file_size INTEGER NOT NULL,
  file_url TEXT,
  processing_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  transactions_extracted INTEGER DEFAULT 0,
  error_message TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_uploaded_files_user ON uploaded_files(user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_status ON uploaded_files(processing_status);

-- Add RLS policies for uploaded_files
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own uploaded files" ON uploaded_files;
CREATE POLICY "Users can view own uploaded files"
  ON uploaded_files FOR SELECT
  USING (auth.uid()::text IN (
    SELECT clerk_user_id FROM users WHERE id = uploaded_files.user_id
  ));

DROP POLICY IF EXISTS "Users can insert own uploaded files" ON uploaded_files;
CREATE POLICY "Users can insert own uploaded files"
  ON uploaded_files FOR INSERT
  WITH CHECK (auth.uid()::text IN (
    SELECT clerk_user_id FROM users WHERE id = uploaded_files.user_id
  ));

DROP POLICY IF EXISTS "Users can update own uploaded files" ON uploaded_files;
CREATE POLICY "Users can update own uploaded files"
  ON uploaded_files FOR UPDATE
  USING (auth.uid()::text IN (
    SELECT clerk_user_id FROM users WHERE id = uploaded_files.user_id
  ));

-- Add ml_category field to transactions for ML-based categorization
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS ml_category TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS ml_confidence NUMERIC(5, 2);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual'; -- 'manual', 'uploaded', 'gpay', 'bank'
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS uploaded_file_id UUID REFERENCES uploaded_files(id) ON DELETE SET NULL;

-- Create index for faster ML category queries
CREATE INDEX IF NOT EXISTS idx_transactions_ml_category ON transactions(ml_category);
CREATE INDEX IF NOT EXISTS idx_transactions_source ON transactions(source);

-- Verify the changes
SELECT 'Categories table' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'categories' 
  AND column_name IN ('is_custom', 'created_by_user')
UNION ALL
SELECT 'Transactions table', column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'transactions' 
  AND column_name IN ('ml_category', 'ml_confidence', 'source', 'uploaded_file_id')
UNION ALL
SELECT 'Uploaded files table', column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'uploaded_files'
ORDER BY table_name, column_name;
