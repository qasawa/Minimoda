-- Admin tables for Minimoda admin panel
-- Run this if you already have the main schema and just need admin tables

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin activity logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin 2FA codes table (for future use)
CREATE TABLE IF NOT EXISTS admin_2fa_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for admin tables
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_activity_user_id ON admin_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_2fa_user_id ON admin_2fa_codes(user_id);

-- Enable RLS for admin tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_2fa_codes ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin tables
CREATE POLICY "Admin users can view themselves" ON admin_users
  FOR SELECT USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Super admin full access to admin_users" ON admin_users
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Admin activity logs viewable by owner" ON admin_activity_logs
  FOR SELECT USING (user_id::text = auth.jwt() ->> 'sub');

CREATE POLICY "Admin activity logs insertable by anyone" ON admin_activity_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin 2FA codes manageable by owner" ON admin_2fa_codes
  FOR ALL USING (user_id::text = auth.jwt() ->> 'sub');
