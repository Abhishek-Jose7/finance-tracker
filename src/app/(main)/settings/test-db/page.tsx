"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TestDatabasePage() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testConnection = async () => {
    setTesting(true);
    setResults(null);

    const testResults = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      connection: false,
      usersTable: false,
      transactionsTable: false,
      categoriesTable: false,
      chatMessagesTable: false,
      error: null as string | null,
    };

    try {
      // Test basic connection
      const { data, error } = await supabase.from('users').select('count');
      if (!error) {
        testResults.connection = true;
        testResults.usersTable = true;
      } else {
        testResults.error = error.message;
      }

      // Test transactions table
      try {
        const { error: txError } = await supabase.from('transactions').select('count');
        if (!txError) testResults.transactionsTable = true;
      } catch (e) {}

      // Test categories table
      try {
        const { error: catError } = await supabase.from('categories').select('count');
        if (!catError) testResults.categoriesTable = true;
      } catch (e) {}

      // Test chat_messages table
      try {
        const { error: chatError } = await supabase.from('chat_messages').select('count');
        if (!chatError) testResults.chatMessagesTable = true;
      } catch (e) {}

    } catch (error: any) {
      testResults.error = error.message;
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Connection Test
          </CardTitle>
          <CardDescription>
            Test your Supabase database connection and verify all tables are accessible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={testConnection} disabled={testing} className="w-full">
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Run Database Test
              </>
            )}
          </Button>

          {results && (
            <div className="space-y-3">
              <TestResult 
                label="Supabase URL Configured" 
                status={results.supabaseUrl} 
              />
              <TestResult 
                label="Supabase API Key Configured" 
                status={results.supabaseKey} 
              />
              <TestResult 
                label="Database Connection" 
                status={results.connection} 
              />
              <TestResult 
                label="Users Table Access" 
                status={results.usersTable} 
              />
              <TestResult 
                label="Transactions Table Access" 
                status={results.transactionsTable} 
              />
              <TestResult 
                label="Categories Table Access" 
                status={results.categoriesTable} 
              />
              <TestResult 
                label="Chat Messages Table Access" 
                status={results.chatMessagesTable} 
              />

              {results.error && (
                <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                  <p className="text-sm text-red-200">
                    <strong>Error:</strong> {results.error}
                  </p>
                </div>
              )}

              <div className="pt-4">
                {results.connection ? (
                  <Badge className="bg-green-500">
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Database Connected Successfully
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="mr-1 h-4 w-4" />
                    Database Connection Failed
                  </Badge>
                )}
              </div>

              {!results.supabaseUrl || !results.supabaseKey && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                  <p className="text-sm text-yellow-200">
                    <strong>Configuration Missing:</strong> Please check your <code>.env</code> file and ensure:
                    <br />• NEXT_PUBLIC_SUPABASE_URL is set
                    <br />• NEXT_PUBLIC_SUPABASE_ANON_KEY is set
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TestResult({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
      <span className="text-sm">{label}</span>
      {status ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      )}
    </div>
  );
}
