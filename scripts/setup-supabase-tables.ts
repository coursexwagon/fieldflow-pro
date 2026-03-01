/**
 * Supabase Table Setup Script
 * 
 * This script creates the required database tables in Supabase.
 * It tries multiple approaches:
 * 1. Direct SQL via Supabase RPC (if available)
 * 2. Provides SQL for manual execution in Supabase Dashboard
 */

const SUPABASE_URL = 'https://gklaggowcdlbkvknwmeg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbGFnZ293Y2RsYmt2a253bWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDgzMjEsImV4cCI6MjA4Nzg4NDMyMX0.ec8PUraCzoRhMxrSQc78QQEDc6rmgIx1UsCqx6M9QSQ';

const CREATE_TABLES_SQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  businessName TEXT,
  tradeType TEXT,
  avatar TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip TEXT,
  notes TEXT,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'SCHEDULED',
  "scheduledAt" TIMESTAMPTZ,
  duration INTEGER,
  price DECIMAL(10,2),
  "completedAt" TIMESTAMPTZ,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "customerId" TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  url TEXT NOT NULL,
  "publicId" TEXT,
  caption TEXT,
  "jobId" TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "invoiceNumber" TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'DRAFT',
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  "dueDate" TIMESTAMPTZ,
  "paidAt" TIMESTAMPTZ,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "customerId" TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  "jobId" TEXT UNIQUE REFERENCES jobs(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  "unitPrice" DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  "invoiceId" TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_userId ON customers("userId");
CREATE INDEX IF NOT EXISTS idx_jobs_userId ON jobs("userId");
CREATE INDEX IF NOT EXISTS idx_jobs_customerId ON jobs("customerId");
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_invoices_userId ON invoices("userId");
CREATE INDEX IF NOT EXISTS idx_invoices_customerId ON invoices("customerId");
CREATE INDEX IF NOT EXISTS idx_photos_jobId ON photos("jobId");
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoiceId ON invoice_items("invoiceId");

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies for anon access (for development)
CREATE POLICY "Allow all for anon" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON invoice_items FOR ALL USING (true) WITH CHECK (true);
`;

async function checkTables(): Promise<{ exists: boolean; tables: string[] }> {
  const tables = ['users', 'customers', 'jobs', 'invoices', 'photos', 'invoice_items'];
  const existingTables: string[] = [];

  for (const table of tables) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id&limit=1`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      
      if (response.ok) {
        existingTables.push(table);
      }
    } catch {
      // Table doesn't exist
    }
  }

  return {
    exists: existingTables.length === tables.length,
    tables: existingTables,
  };
}

async function main() {
  console.log('🔍 Checking Supabase database tables...\n');
  
  const result = await checkTables();
  
  if (result.exists) {
    console.log('✅ All tables already exist!');
    console.log('Tables:', result.tables.join(', '));
    return;
  }

  console.log('❌ Some tables are missing.');
  console.log('Existing tables:', result.tables.length > 0 ? result.tables.join(', ') : 'None');
  
  console.log('\n📋 SQL TO RUN IN SUPABASE DASHBOARD:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/gklaggowcdlbkvknwmeg/sql/new');
  console.log('2. Paste the following SQL and click Run:\n');
  console.log('```sql');
  console.log(CREATE_TABLES_SQL);
  console.log('```\n');
}

main().catch(console.error);
