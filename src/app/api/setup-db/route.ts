import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

// SQL to create all required tables
const createTablesSQL = `
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
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
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
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'SCHEDULED',
  scheduledAt TIMESTAMPTZ,
  duration INTEGER,
  price DECIMAL(10,2),
  completedAt TIMESTAMPTZ,
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customerId TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  url TEXT NOT NULL,
  publicId TEXT,
  caption TEXT,
  jobId TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  invoiceNumber TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'DRAFT',
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  dueDate TIMESTAMPTZ,
  paidAt TIMESTAMPTZ,
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customerId TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  jobId TEXT UNIQUE REFERENCES jobs(id) ON DELETE SET NULL,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unitPrice DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  invoiceId TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_userId ON customers(userId);
CREATE INDEX IF NOT EXISTS idx_jobs_userId ON jobs(userId);
CREATE INDEX IF NOT EXISTS idx_jobs_customerId ON jobs(customerId);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_invoices_userId ON invoices(userId);
CREATE INDEX IF NOT EXISTS idx_invoices_customerId ON invoices(customerId);
CREATE INDEX IF NOT EXISTS idx_photos_jobId ON photos(jobId);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoiceId ON invoice_items(invoiceId);
`;

export async function GET() {
  try {
    // Check if users table exists by trying to select from it
    const { error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError) {
      console.log('Users table check error:', usersError);
      
      if (usersError.code === 'PGRST116' || usersError.code === '42P01' || usersError.message?.includes('does not exist')) {
        return NextResponse.json({
          status: 'tables_needed',
          message: 'Tables need to be created in Supabase dashboard',
          instructions: 'Run the SQL in Supabase SQL Editor',
          sql: createTablesSQL
        });
      }
      
      throw usersError;
    }
    
    // Check other tables
    const { error: customersError } = await supabase
      .from('customers')
      .select('id')
      .limit(1);
    
    const { error: jobsError } = await supabase
      .from('jobs')
      .select('id')
      .limit(1);
    
    const { error: invoicesError } = await supabase
      .from('invoices')
      .select('id')
      .limit(1);
    
    const tables = {
      users: !usersError,
      customers: !customersError,
      jobs: !jobsError,
      invoices: !invoicesError
    };
    
    const allTablesExist = Object.values(tables).every(v => v);
    
    if (!allTablesExist) {
      return NextResponse.json({
        status: 'partial',
        tables,
        message: 'Some tables are missing',
        sql: createTablesSQL
      });
    }
    
    return NextResponse.json({
      status: 'connected',
      message: 'All database tables exist and are accessible',
      tables
    });
  } catch (error: unknown) {
    console.error('DB setup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      status: 'error',
      error: errorMessage,
      instructions: 'Please create the tables manually in Supabase SQL Editor',
      sql: createTablesSQL
    }, { status: 500 });
  }
}

export async function POST() {
  // This endpoint provides the SQL to run manually
  return NextResponse.json({
    sql: createTablesSQL,
    instructions: [
      '1. Go to Supabase Dashboard (https://supabase.com/dashboard)',
      '2. Select your project',
      '3. Navigate to SQL Editor',
      '4. Paste and run the SQL above',
      '5. Return to this app and refresh'
    ]
  });
}
