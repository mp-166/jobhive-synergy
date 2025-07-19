-- Additional SQL functions for Empower platform
-- These functions support the backend API functions

-- Function to update worker statistics (used by escrow-payment function)
CREATE OR REPLACE FUNCTION update_worker_stats(worker_id UUID, earnings DECIMAL, jobs_completed INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles 
    SET 
        total_earnings = COALESCE(total_earnings, 0) + earnings,
        total_jobs_completed = COALESCE(total_jobs_completed, 0) + jobs_completed,
        updated_at = NOW()
    WHERE id = worker_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user verification score (used by verification-system function)
CREATE OR REPLACE FUNCTION calculate_verification_score(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_docs INTEGER;
    verified_docs INTEGER;
    score INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_docs 
    FROM document_verifications 
    WHERE user_id = $1;
    
    SELECT COUNT(*) INTO verified_docs 
    FROM document_verifications 
    WHERE user_id = $1 AND verification_status = 'verified';
    
    IF total_docs > 0 THEN
        score := ROUND((verified_docs::DECIMAL / total_docs::DECIMAL) * 100);
    ELSE
        score := 0;
    END IF;
    
    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user meets minimum verification requirements
CREATE OR REPLACE FUNCTION check_minimum_verification(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_identity BOOLEAN := FALSE;
    has_address BOOLEAN := FALSE;
BEGIN
    -- Check for identity proof (Aadhar or PAN)
    SELECT EXISTS (
        SELECT 1 FROM document_verifications 
        WHERE user_id = $1 
        AND document_type IN ('aadhar', 'pan') 
        AND verification_status = 'verified'
    ) INTO has_identity;
    
    -- Check for address proof
    SELECT EXISTS (
        SELECT 1 FROM document_verifications 
        WHERE user_id = $1 
        AND document_type = 'address_proof' 
        AND verification_status = 'verified'
    ) INTO has_address;
    
    RETURN has_identity AND has_address;
END;
$$ LANGUAGE plpgsql;

-- Function to send job alerts to nearby workers (used by notification-system function)
CREATE OR REPLACE FUNCTION send_job_alerts_to_nearby_workers(
    job_id UUID,
    max_distance_km INTEGER DEFAULT 50
)
RETURNS INTEGER AS $$
DECLARE
    job_record RECORD;
    worker_record RECORD;
    alert_count INTEGER := 0;
BEGIN
    -- Get job details
    SELECT * INTO job_record FROM jobs WHERE id = job_id;
    
    -- Find workers with matching skills in nearby location
    FOR worker_record IN 
        SELECT DISTINCT p.id, p.phone, p.first_name
        FROM profiles p
        JOIN user_skills us ON p.id = us.user_id
        JOIN skills_catalog sc ON us.skill_id = sc.id
        WHERE p.user_type = 'worker'
        AND p.is_active = true
        AND p.phone IS NOT NULL
        AND sc.name = ANY(job_record.skills)
        AND p.location ILIKE '%' || split_part(job_record.location, ',', 1) || '%'
    LOOP
        -- Insert SMS notification
        INSERT INTO sms_notifications (phone_number, message, status)
        VALUES (
            worker_record.phone,
            'New job: ' || job_record.title || ' in ' || job_record.location || 
            '. Salary: ₹' || job_record.salary_min || '-' || job_record.salary_max || 
            '. Call 1800-123-4567 or visit empower.com',
            'pending'
        );
        
        alert_count := alert_count + 1;
    END LOOP;
    
    RETURN alert_count;
END;
$$ LANGUAGE plpgsql;

-- Function to check subscription limits (used by subscription-management function)
CREATE OR REPLACE FUNCTION check_subscription_limit(
    user_id UUID,
    limit_type VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
    user_plan VARCHAR(20);
    current_usage INTEGER;
    plan_limit INTEGER;
BEGIN
    -- Get user's current plan
    SELECT subscription_type INTO user_plan 
    FROM profiles 
    WHERE id = user_id;
    
    -- Get current month usage and limits based on plan
    CASE limit_type
        WHEN 'job_postings' THEN
            SELECT COUNT(*) INTO current_usage
            FROM jobs 
            WHERE employer_id = user_id 
            AND created_at >= DATE_TRUNC('month', CURRENT_DATE);
            
            CASE user_plan
                WHEN 'basic' THEN plan_limit := 5;
                WHEN 'premium' THEN plan_limit := 20;
                WHEN 'enterprise' THEN plan_limit := -1; -- Unlimited
                ELSE plan_limit := 1; -- Free plan
            END CASE;
            
        WHEN 'applications' THEN
            SELECT COUNT(*) INTO current_usage
            FROM job_applications 
            WHERE applicant_id = user_id 
            AND created_at >= DATE_TRUNC('month', CURRENT_DATE);
            
            CASE user_plan
                WHEN 'basic' THEN plan_limit := 50;
                WHEN 'premium' THEN plan_limit := 200;
                WHEN 'enterprise' THEN plan_limit := -1; -- Unlimited
                ELSE plan_limit := 10; -- Free plan
            END CASE;
    END CASE;
    
    -- Return true if within limits
    RETURN (plan_limit = -1 OR current_usage < plan_limit);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate monthly recurring revenue (MRR)
CREATE OR REPLACE FUNCTION calculate_mrr()
RETURNS DECIMAL AS $$
DECLARE
    total_mrr DECIMAL := 0;
    sub_record RECORD;
BEGIN
    FOR sub_record IN 
        SELECT plan_type, plan_duration, amount, COUNT(*) as subscription_count
        FROM subscriptions 
        WHERE status = 'active'
        GROUP BY plan_type, plan_duration, amount
    LOOP
        CASE sub_record.plan_duration
            WHEN 'monthly' THEN 
                total_mrr := total_mrr + (sub_record.amount * sub_record.subscription_count);
            WHEN 'quarterly' THEN 
                total_mrr := total_mrr + ((sub_record.amount / 3) * sub_record.subscription_count);
            WHEN 'yearly' THEN 
                total_mrr := total_mrr + ((sub_record.amount / 12) * sub_record.subscription_count);
        END CASE;
    END LOOP;
    
    RETURN total_mrr;
END;
$$ LANGUAGE plpgsql;

-- Function to update user rating after job completion
CREATE OR REPLACE FUNCTION update_user_rating(user_id UUID, new_rating DECIMAL)
RETURNS VOID AS $$
DECLARE
    current_rating DECIMAL;
    total_reviews INTEGER;
    updated_rating DECIMAL;
BEGIN
    -- Get current rating and review count
    SELECT 
        COALESCE(rating, 0),
        COALESCE(total_jobs_completed, 0)
    INTO current_rating, total_reviews
    FROM profiles 
    WHERE id = user_id;
    
    -- Calculate new average rating
    IF total_reviews = 0 THEN
        updated_rating := new_rating;
    ELSE
        updated_rating := ((current_rating * total_reviews) + new_rating) / (total_reviews + 1);
    END IF;
    
    -- Update user profile
    UPDATE profiles 
    SET rating = ROUND(updated_rating, 2)
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get job recommendations for a user
CREATE OR REPLACE FUNCTION get_job_recommendations(
    user_id UUID,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    job_id UUID,
    title TEXT,
    location TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    match_score INTEGER
) AS $$
DECLARE
    user_location TEXT;
    user_skills TEXT[];
BEGIN
    -- Get user location and skills
    SELECT location INTO user_location FROM profiles WHERE id = user_id;
    
    SELECT ARRAY_AGG(sc.name) INTO user_skills
    FROM user_skills us
    JOIN skills_catalog sc ON us.skill_id = sc.id
    WHERE us.user_id = user_id;
    
    -- Return job recommendations with match scores
    RETURN QUERY
    SELECT 
        j.id,
        j.title,
        j.location,
        j.salary_min,
        j.salary_max,
        -- Simple scoring algorithm (can be enhanced)
        CASE 
            WHEN j.location ILIKE '%' || split_part(user_location, ',', 1) || '%' THEN 50
            ELSE 0
        END +
        CASE 
            WHEN j.skills && user_skills THEN 30
            ELSE 0
        END +
        CASE 
            WHEN j.urgency_level = 'urgent' THEN 20
            ELSE 0
        END AS match_score
    FROM jobs j
    WHERE j.status = 'open'
    AND j.employer_id != user_id
    ORDER BY match_score DESC, j.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get platform statistics
CREATE OR REPLACE FUNCTION get_platform_statistics()
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM profiles),
        'total_workers', (SELECT COUNT(*) FROM profiles WHERE user_type = 'worker'),
        'total_employers', (SELECT COUNT(*) FROM profiles WHERE user_type = 'employer'),
        'active_jobs', (SELECT COUNT(*) FROM jobs WHERE status = 'open'),
        'completed_jobs', (SELECT COUNT(*) FROM jobs WHERE status = 'completed'),
        'total_applications', (SELECT COUNT(*) FROM job_applications),
        'verified_users', (SELECT COUNT(*) FROM profiles WHERE verified = true),
        'active_subscriptions', (SELECT COUNT(*) FROM subscriptions WHERE status = 'active'),
        'monthly_revenue', (SELECT calculate_mrr()),
        'featured_jobs', (SELECT COUNT(*) FROM jobs WHERE featured = true AND featured_until > NOW())
    ) INTO stats;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired featured jobs
CREATE OR REPLACE FUNCTION cleanup_expired_featured_jobs()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE jobs 
    SET featured = false, featured_until = NULL
    WHERE featured = true 
    AND featured_until < NOW();
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to expire subscriptions
CREATE OR REPLACE FUNCTION expire_subscriptions()
RETURNS INTEGER AS $$
DECLARE
    expired_count INTEGER;
BEGIN
    -- Update expired subscriptions
    UPDATE subscriptions 
    SET status = 'expired'
    WHERE status = 'active' 
    AND expires_at < NOW();
    
    GET DIAGNOSTICS expired_count = ROW_COUNT;
    
    -- Update user profiles for expired subscriptions
    UPDATE profiles 
    SET subscription_type = 'free'
    WHERE id IN (
        SELECT user_id FROM subscriptions 
        WHERE status = 'expired' 
        AND expires_at < NOW()
    );
    
    RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- Function to send reminder notifications for pending applications
CREATE OR REPLACE FUNCTION send_application_reminders()
RETURNS INTEGER AS $$
DECLARE
    reminder_count INTEGER := 0;
    app_record RECORD;
BEGIN
    -- Find applications that are pending for more than 24 hours
    FOR app_record IN 
        SELECT ja.*, j.title, p.first_name, p.id as employer_id
        FROM job_applications ja
        JOIN jobs j ON ja.job_id = j.id
        JOIN profiles p ON j.employer_id = p.id
        WHERE ja.status = 'applied'
        AND ja.created_at < NOW() - INTERVAL '24 hours'
        AND NOT EXISTS (
            SELECT 1 FROM notifications n 
            WHERE n.user_id = p.id 
            AND n.message LIKE '%pending application%'
            AND n.created_at > NOW() - INTERVAL '24 hours'
        )
    LOOP
        -- Send reminder notification to employer
        INSERT INTO notifications (user_id, title, message, type, action_url)
        VALUES (
            app_record.employer_id,
            'Pending Application Reminder',
            'You have a pending application for: ' || app_record.title || '. Please review and respond.',
            'application',
            '/jobs/' || app_record.job_id || '/applications'
        );
        
        reminder_count := reminder_count + 1;
    END LOOP;
    
    RETURN reminder_count;
END;
$$ LANGUAGE plpgsql;

-- Create a function to be called by cron jobs for maintenance
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS JSON AS $$
DECLARE
    maintenance_result JSON;
    expired_featured INTEGER;
    expired_subs INTEGER;
    sent_reminders INTEGER;
BEGIN
    -- Perform daily maintenance tasks
    SELECT cleanup_expired_featured_jobs() INTO expired_featured;
    SELECT expire_subscriptions() INTO expired_subs;
    SELECT send_application_reminders() INTO sent_reminders;
    
    -- Return maintenance summary
    SELECT json_build_object(
        'expired_featured_jobs', expired_featured,
        'expired_subscriptions', expired_subs,
        'reminder_notifications_sent', sent_reminders,
        'maintenance_date', NOW()
    ) INTO maintenance_result;
    
    RETURN maintenance_result;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance on new tables
CREATE INDEX IF NOT EXISTS idx_document_verifications_user_status ON document_verifications(user_id, verification_status);
CREATE INDEX IF NOT EXISTS idx_escrow_payments_job_status ON escrow_payments(job_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON transactions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_verified ON user_skills(user_id, verified);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_user_status ON training_enrollments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_sms_notifications_status ON sms_notifications(status);
CREATE INDEX IF NOT EXISTS idx_job_categories_active ON job_categories(is_active);

-- Add some useful views
CREATE OR REPLACE VIEW active_workers AS
SELECT 
    p.*,
    COUNT(us.skill_id) as skills_count,
    COUNT(j.id) as jobs_completed_count
FROM profiles p
LEFT JOIN user_skills us ON p.id = us.user_id
LEFT JOIN jobs j ON p.id = j.employer_id AND j.status = 'completed'
WHERE p.user_type = 'worker' 
AND p.is_active = true
GROUP BY p.id;

CREATE OR REPLACE VIEW job_stats AS
SELECT 
    j.*,
    COUNT(ja.id) as application_count,
    AVG(r.rating) as average_rating,
    COUNT(r.id) as review_count
FROM jobs j
LEFT JOIN job_applications ja ON j.id = ja.job_id
LEFT JOIN reviews r ON j.id = r.job_id
GROUP BY j.id;

-- Grant necessary permissions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON active_workers TO authenticated;
GRANT SELECT ON job_stats TO authenticated;