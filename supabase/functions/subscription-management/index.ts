import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubscriptionRequest {
  action: 'create_subscription' | 'upgrade_subscription' | 'cancel_subscription' | 'get_subscription' | 'feature_job' | 'get_revenue_stats';
  planType?: 'basic' | 'premium' | 'enterprise';
  planDuration?: 'monthly' | 'quarterly' | 'yearly';
  paymentMethod?: string;
  jobId?: string;
  featureDuration?: number; // days
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

interface PricingPlan {
  type: string;
  name: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: {
    jobPostings: number;
    applicationsPerMonth: number;
    verifiedSkills: number;
    prioritySupport: boolean;
    autoMatching: boolean;
    analytics: boolean;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const {
      action,
      planType,
      planDuration,
      paymentMethod,
      jobId,
      featureDuration,
      dateRange
    }: SubscriptionRequest = await req.json();

    // Pricing plans configuration
    const pricingPlans: { [key: string]: PricingPlan } = {
      basic: {
        type: 'basic',
        name: 'Basic Plan',
        monthlyPrice: 299,
        quarterlyPrice: 799,
        yearlyPrice: 2999,
        features: [
          'Post up to 5 jobs per month',
          'Basic job matching',
          'Standard support',
          'Basic analytics'
        ],
        limits: {
          jobPostings: 5,
          applicationsPerMonth: 50,
          verifiedSkills: 3,
          prioritySupport: false,
          autoMatching: false,
          analytics: false
        }
      },
      premium: {
        type: 'premium',
        name: 'Premium Plan',
        monthlyPrice: 599,
        quarterlyPrice: 1599,
        yearlyPrice: 5999,
        features: [
          'Post up to 20 jobs per month',
          'AI-powered auto-matching',
          'Priority support',
          'Advanced analytics',
          'Featured job listings',
          'Skills verification'
        ],
        limits: {
          jobPostings: 20,
          applicationsPerMonth: 200,
          verifiedSkills: 10,
          prioritySupport: true,
          autoMatching: true,
          analytics: true
        }
      },
      enterprise: {
        type: 'enterprise',
        name: 'Enterprise Plan',
        monthlyPrice: 1999,
        quarterlyPrice: 5399,
        yearlyPrice: 19999,
        features: [
          'Unlimited job postings',
          'Custom branding',
          'Dedicated account manager',
          'API access',
          'Custom integrations',
          'White-label solution'
        ],
        limits: {
          jobPostings: -1, // Unlimited
          applicationsPerMonth: -1, // Unlimited
          verifiedSkills: -1, // Unlimited
          prioritySupport: true,
          autoMatching: true,
          analytics: true
        }
      }
    };

    // Calculate subscription price
    const calculateSubscriptionPrice = (planType: string, duration: string): number => {
      const plan = pricingPlans[planType];
      if (!plan) throw new Error('Invalid plan type');

      switch (duration) {
        case 'monthly':
          return plan.monthlyPrice;
        case 'quarterly':
          return plan.quarterlyPrice;
        case 'yearly':
          return plan.yearlyPrice;
        default:
          throw new Error('Invalid plan duration');
      }
    };

    // Calculate subscription end date
    const calculateEndDate = (duration: string): string => {
      const now = new Date();
      switch (duration) {
        case 'monthly':
          now.setMonth(now.getMonth() + 1);
          break;
        case 'quarterly':
          now.setMonth(now.getMonth() + 3);
          break;
        case 'yearly':
          now.setFullYear(now.getFullYear() + 1);
          break;
      }
      return now.toISOString();
    };

    switch (action) {
      case 'create_subscription': {
        if (!planType || !planDuration || !paymentMethod) {
          throw new Error('Plan type, duration, and payment method are required');
        }

        // Check if user already has an active subscription
        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (existingSubscription) {
          throw new Error('User already has an active subscription. Please upgrade or cancel first.');
        }

        const price = calculateSubscriptionPrice(planType, planDuration);
        const endDate = calculateEndDate(planDuration);
        const plan = pricingPlans[planType];

        // Create subscription record
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            plan_type: planType,
            plan_duration: planDuration,
            amount: price,
            status: 'active',
            expires_at: endDate,
            payment_method: paymentMethod
          })
          .select()
          .single();

        if (subError) {
          throw new Error(`Failed to create subscription: ${subError.message}`);
        }

        // Update user profile with subscription info
        await supabase
          .from('profiles')
          .update({
            subscription_type: planType,
            subscription_expires_at: endDate
          })
          .eq('id', user.id);

        // Create transaction record
        await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            type: 'subscription',
            amount: -price,
            description: `${plan.name} subscription (${planDuration})`,
            payment_method: paymentMethod,
            transaction_id: subscription.id
          });

        // Send notification
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title: 'Subscription Activated!',
            message: `Your ${plan.name} subscription is now active. Enjoy premium features!`,
            type: 'system'
          });

        return new Response(
          JSON.stringify({
            success: true,
            subscription,
            plan: plan,
            message: 'Subscription created successfully'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'upgrade_subscription': {
        if (!planType || !planDuration) {
          throw new Error('Plan type and duration are required');
        }

        // Get current subscription
        const { data: currentSubscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (!currentSubscription) {
          throw new Error('No active subscription found. Please create a new subscription.');
        }

        const currentPlan = pricingPlans[currentSubscription.plan_type];
        const newPlan = pricingPlans[planType];
        const newPrice = calculateSubscriptionPrice(planType, planDuration);
        const endDate = calculateEndDate(planDuration);

        // Calculate prorated amount (simplified - in production you'd have more complex logic)
        const daysRemaining = Math.ceil((new Date(currentSubscription.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const proratedCredit = Math.max(0, (currentSubscription.amount * daysRemaining) / 30); // Approximate monthly proration
        const upgradeAmount = Math.max(0, newPrice - proratedCredit);

        // Cancel current subscription
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('id', currentSubscription.id);

        // Create new subscription
        const { data: newSubscription, error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            plan_type: planType,
            plan_duration: planDuration,
            amount: newPrice,
            status: 'active',
            expires_at: endDate,
            payment_method: currentSubscription.payment_method
          })
          .select()
          .single();

        if (subError) {
          throw new Error(`Failed to create new subscription: ${subError.message}`);
        }

        // Update user profile
        await supabase
          .from('profiles')
          .update({
            subscription_type: planType,
            subscription_expires_at: endDate
          })
          .eq('id', user.id);

        // Create transaction record
        await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            type: 'subscription',
            amount: -upgradeAmount,
            description: `Upgraded from ${currentPlan.name} to ${newPlan.name}`,
            payment_method: currentSubscription.payment_method,
            transaction_id: newSubscription.id
          });

        return new Response(
          JSON.stringify({
            success: true,
            subscription: newSubscription,
            upgradeAmount,
            proratedCredit,
            message: 'Subscription upgraded successfully'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'cancel_subscription': {
        // Get current subscription
        const { data: subscription, error: getError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (getError || !subscription) {
          throw new Error('No active subscription found');
        }

        // Cancel subscription (but let it run until expiry)
        const { error: cancelError } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            auto_renew: false
          })
          .eq('id', subscription.id);

        if (cancelError) {
          throw new Error(`Failed to cancel subscription: ${cancelError.message}`);
        }

        // Send notification
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title: 'Subscription Cancelled',
            message: `Your subscription has been cancelled. You can continue using premium features until ${new Date(subscription.expires_at).toLocaleDateString()}.`,
            type: 'system'
          });

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Subscription cancelled successfully',
            accessUntil: subscription.expires_at
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_subscription': {
        // Get user's subscription and plan details
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_type, subscription_expires_at')
          .eq('id', user.id)
          .single();

        let planDetails = null;
        let usageStats = null;

        if (subscription && profile?.subscription_type) {
          planDetails = pricingPlans[profile.subscription_type];

          // Get usage statistics
          const currentMonth = new Date();
          currentMonth.setDate(1);
          currentMonth.setHours(0, 0, 0, 0);

          const { data: jobsThisMonth } = await supabase
            .from('jobs')
            .select('count(*)', { count: 'exact' })
            .eq('employer_id', user.id)
            .gte('created_at', currentMonth.toISOString());

          const { data: applicationsThisMonth } = await supabase
            .from('job_applications')
            .select('count(*)', { count: 'exact' })
            .eq('applicant_id', user.id)
            .gte('created_at', currentMonth.toISOString());

          usageStats = {
            jobPostingsThisMonth: jobsThisMonth?.[0]?.count || 0,
            applicationsThisMonth: applicationsThisMonth?.[0]?.count || 0,
            jobPostingsLimit: planDetails?.limits.jobPostings || 0,
            applicationsLimit: planDetails?.limits.applicationsPerMonth || 0
          };
        }

        return new Response(
          JSON.stringify({
            success: true,
            subscription,
            planDetails,
            usageStats,
            hasActiveSubscription: !!subscription
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'feature_job': {
        if (!jobId || !featureDuration) {
          throw new Error('Job ID and feature duration are required');
        }

        // Check if user owns the job
        const { data: job, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .eq('employer_id', user.id)
          .single();

        if (jobError || !job) {
          throw new Error('Job not found or you do not have permission');
        }

        // Calculate feature cost (₹50 per day)
        const featureCost = featureDuration * 50;
        const featureEndDate = new Date();
        featureEndDate.setDate(featureEndDate.getDate() + featureDuration);

        // Update job to featured
        const { error: updateError } = await supabase
          .from('jobs')
          .update({
            featured: true,
            featured_until: featureEndDate.toISOString()
          })
          .eq('id', jobId);

        if (updateError) {
          throw new Error(`Failed to feature job: ${updateError.message}`);
        }

        // Create transaction record
        await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            job_id: jobId,
            type: 'payment',
            amount: -featureCost,
            description: `Featured job listing for ${featureDuration} days`,
            payment_method: 'account_balance'
          });

        return new Response(
          JSON.stringify({
            success: true,
            featureCost,
            featuredUntil: featureEndDate.toISOString(),
            message: 'Job featured successfully'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_revenue_stats': {
        if (!dateRange) {
          throw new Error('Date range is required');
        }

        // Check if user has admin privileges
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (!userProfile || userProfile.user_type !== 'admin') {
          throw new Error('Insufficient privileges to view revenue statistics');
        }

        const { startDate, endDate } = dateRange;

        // Get revenue from different sources
        const { data: subscriptionRevenue } = await supabase
          .from('transactions')
          .select('amount')
          .eq('type', 'subscription')
          .gte('created_at', startDate)
          .lte('created_at', endDate);

        const { data: commissionRevenue } = await supabase
          .from('transactions')
          .select('amount')
          .eq('type', 'commission')
          .gte('created_at', startDate)
          .lte('created_at', endDate);

        const { data: featuredListingsRevenue } = await supabase
          .from('transactions')
          .select('amount')
          .eq('description', 'Featured job listing')
          .gte('created_at', startDate)
          .lte('created_at', endDate);

        // Calculate totals
        const totalSubscriptionRevenue = subscriptionRevenue?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
        const totalCommissionRevenue = commissionRevenue?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
        const totalFeaturedRevenue = featuredListingsRevenue?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
        const totalRevenue = totalSubscriptionRevenue + totalCommissionRevenue + totalFeaturedRevenue;

        // Get user statistics
        const { data: totalUsers } = await supabase
          .from('profiles')
          .select('count(*)', { count: 'exact' })
          .gte('created_at', startDate)
          .lte('created_at', endDate);

        const { data: activeSubscriptions } = await supabase
          .from('subscriptions')
          .select('count(*)', { count: 'exact' })
          .eq('status', 'active');

        const { data: completedJobs } = await supabase
          .from('jobs')
          .select('count(*)', { count: 'exact' })
          .eq('status', 'completed')
          .gte('updated_at', startDate)
          .lte('updated_at', endDate);

        return new Response(
          JSON.stringify({
            success: true,
            revenueStats: {
              totalRevenue,
              subscriptionRevenue: totalSubscriptionRevenue,
              commissionRevenue: totalCommissionRevenue,
              featuredListingsRevenue: totalFeaturedRevenue,
              newUsers: totalUsers?.[0]?.count || 0,
              activeSubscriptions: activeSubscriptions?.[0]?.count || 0,
              completedJobs: completedJobs?.[0]?.count || 0,
              dateRange: { startDate, endDate }
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Subscription management error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

/* Additional SQL functions for subscription management:

-- Function to check subscription limits
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

*/