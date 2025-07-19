-- Empower Platform Schema Enhancement
-- This migration enhances the existing schema to support all Empower platform features

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enhanced profiles table with additional fields for Empower
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS aadhar_number VARCHAR(12);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pan_number VARCHAR(10);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS driving_license VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ifsc_code VARCHAR(11);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_jobs_completed INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(12,2) DEFAULT 0.0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_type VARCHAR(20) DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP DEFAULT NOW();

-- Enhanced jobs table with additional fields
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS duration_type VARCHAR(20); -- 'hourly', 'daily', 'weekly', 'monthly', 'project'
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS duration_value INTEGER; -- number of hours/days/weeks/months
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS workers_needed INTEGER DEFAULT 1;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS workers_hired INTEGER DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS urgency_level VARCHAR(20) DEFAULT 'normal'; -- 'low', 'normal', 'high', 'urgent'
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS subcategory VARCHAR(50);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS auto_match BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS total_budget DECIMAL(12,2);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending'; -- 'pending', 'escrowed', 'released', 'refunded'

-- Document verification table
CREATE TABLE IF NOT EXISTS document_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'aadhar', 'pan', 'driving_license', 'bank_statement', 'address_proof'
    document_url TEXT NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verified_by UUID REFERENCES profiles(id),
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Escrow payments table (enhanced payment_deposits)
CREATE TABLE IF NOT EXISTS escrow_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    employer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    platform_fee DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'escrowed', 'released', 'refunded', 'disputed'
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    escrowed_at TIMESTAMP,
    released_at TIMESTAMP,
    refunded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_type VARCHAR(20) NOT NULL, -- 'basic', 'premium', 'enterprise'
    plan_duration VARCHAR(20) NOT NULL, -- 'monthly', 'quarterly', 'yearly'
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
    started_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    auto_renew BOOLEAN DEFAULT true,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Transaction history table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL, -- 'payment', 'earning', 'refund', 'subscription', 'commission'
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed'
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'job_match', 'application', 'payment', 'review', 'system'
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- SMS notifications for non-tech users
CREATE TABLE IF NOT EXISTS sms_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Skills catalog table
CREATE TABLE IF NOT EXISTS skills_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    verification_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User skills with proficiency levels
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills_catalog(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced', 'expert'
    years_of_experience INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- Dispute resolution table
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    raised_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    against_user UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'closed'
    resolution TEXT,
    resolved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- Job categories and subcategories
CREATE TABLE IF NOT EXISTS job_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES job_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(category_id, name)
);

-- Training programs table
CREATE TABLE IF NOT EXISTS training_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    duration_hours INTEGER,
    price DECIMAL(10,2),
    instructor_id UUID REFERENCES profiles(id),
    is_online BOOLEAN DEFAULT true,
    location VARCHAR(200),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'full', 'completed', 'cancelled'
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Training enrollments
CREATE TABLE IF NOT EXISTS training_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP DEFAULT NOW(),
    completion_date TIMESTAMP,
    completion_percentage INTEGER DEFAULT 0,
    certificate_url TEXT,
    status VARCHAR(20) DEFAULT 'enrolled', -- 'enrolled', 'completed', 'dropped'
    UNIQUE(program_id, user_id)
);

-- Enhanced job applications with additional fields
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS expected_start_date DATE;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS availability TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS proposed_rate DECIMAL(10,2);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS auto_matched BOOLEAN DEFAULT false;

-- Insert default job categories
INSERT INTO job_categories (name, description, icon) VALUES
('Agriculture', 'Farm work, harvesting, crop management', 'leaf'),
('Driving & Transportation', 'Delivery, taxi, logistics', 'truck'),
('Hospitality & Food', 'Cooking, catering, event management', 'chef-hat'),
('Retail & Sales', 'Shop management, sales assistance', 'shopping-bag'),
('Education & Tutoring', 'Teaching, training, mentoring', 'book-open'),
('Construction & Labor', 'Building, maintenance, manual work', 'hard-hat'),
('Technology & IT', 'Programming, data entry, tech support', 'laptop'),
('Healthcare', 'Nursing, caregiving, medical assistance', 'heart-pulse'),
('Finance & Accounting', 'Bookkeeping, data analysis, consulting', 'calculator'),
('Domestic Services', 'Cleaning, maintenance, personal assistance', 'home')
ON CONFLICT (name) DO NOTHING;

-- Insert default skills
INSERT INTO skills_catalog (name, category, verification_required) VALUES
('Driving (2-Wheeler)', 'Transportation', true),
('Driving (4-Wheeler)', 'Transportation', true),
('Heavy Vehicle Driving', 'Transportation', true),
('Cooking (Indian)', 'Food & Hospitality', false),
('Cooking (Continental)', 'Food & Hospitality', false),
('Farming', 'Agriculture', false),
('Crop Harvesting', 'Agriculture', false),
('Shop Management', 'Retail', false),
('Cash Handling', 'Retail', false),
('Teaching (Primary)', 'Education', false),
('Teaching (Secondary)', 'Education', false),
('Computer Operations', 'Technology', false),
('Data Entry', 'Technology', false),
('Accounting', 'Finance', false),
('Customer Service', 'General', false)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON profiles(verified);
CREATE INDEX IF NOT EXISTS idx_escrow_payments_status ON escrow_payments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to relevant tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_escrow_payments_updated_at ON escrow_payments;
CREATE TRIGGER update_escrow_payments_updated_at BEFORE UPDATE ON escrow_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security policies
ALTER TABLE document_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_enrollments ENABLE ROW LEVEL SECURITY;

-- Policies for document_verifications
CREATE POLICY "Users can view their own document verifications" ON document_verifications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own document verifications" ON document_verifications FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Policies for escrow_payments
CREATE POLICY "Users can view their own payments" ON escrow_payments FOR SELECT USING (auth.uid()::text = employer_id::text OR auth.uid()::text = worker_id::text);

-- Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Policies for user_skills
CREATE POLICY "Users can manage their own skills" ON user_skills FOR ALL USING (auth.uid()::text = user_id::text);

-- Add comments for documentation
COMMENT ON TABLE document_verifications IS 'Stores document verification status for users';
COMMENT ON TABLE escrow_payments IS 'Manages escrow payments between employers and workers';
COMMENT ON TABLE subscriptions IS 'User subscription plans and billing';
COMMENT ON TABLE skills_catalog IS 'Master list of all available skills';
COMMENT ON TABLE user_skills IS 'User skills with proficiency levels';
COMMENT ON TABLE disputes IS 'Dispute resolution between users';
COMMENT ON TABLE training_programs IS 'Available training programs for skill development';