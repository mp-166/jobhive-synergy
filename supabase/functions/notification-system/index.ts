import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  action: 'send_notification' | 'send_sms' | 'send_bulk_sms' | 'mark_read' | 'get_notifications';
  userId?: string;
  userIds?: string[];
  phoneNumber?: string;
  phoneNumbers?: string[];
  title?: string;
  message: string;
  type?: 'job_match' | 'application' | 'payment' | 'review' | 'system' | 'marketing';
  actionUrl?: string;
  notificationId?: string;
  filters?: {
    location?: string;
    skills?: string[];
    categories?: string[];
    userType?: 'worker' | 'employer';
  };
}

interface SMSTemplate {
  type: string;
  template: string;
  variables: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // SMS service configuration (you would use actual SMS providers like Twilio, MSG91, etc.)
    const SMS_API_KEY = Deno.env.get('SMS_API_KEY') || '';
    const SMS_SENDER_ID = Deno.env.get('SMS_SENDER_ID') || 'EMPOWER';

    const authHeader = req.headers.get('Authorization');
    let user = null;
    
    // Some notification actions don't require authentication (like system notifications)
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && authUser) {
        user = authUser;
      }
    }

    const {
      action,
      userId,
      userIds,
      phoneNumber,
      phoneNumbers,
      title,
      message,
      type,
      actionUrl,
      notificationId,
      filters
    }: NotificationRequest = await req.json();

    // SMS templates for different types of notifications
    const smsTemplates: { [key: string]: SMSTemplate } = {
      job_match: {
        type: 'job_match',
        template: 'Hi {name}, new job found: {jobTitle} in {location}. Salary: ₹{salary}. Apply at empower.com or call {supportNumber}',
        variables: ['name', 'jobTitle', 'location', 'salary', 'supportNumber']
      },
      payment_received: {
        type: 'payment',
        template: 'Hi {name}, you received ₹{amount} for job: {jobTitle}. Check details at empower.com or call {supportNumber}',
        variables: ['name', 'amount', 'jobTitle', 'supportNumber']
      },
      job_application: {
        type: 'application',
        template: 'Hi {name}, {applicantName} applied for your job: {jobTitle}. View details at empower.com',
        variables: ['name', 'applicantName', 'jobTitle']
      },
      job_alert: {
        type: 'marketing',
        template: 'New jobs available in {location} for {category} workers. Daily earnings up to ₹{maxSalary}. Register at empower.com',
        variables: ['location', 'category', 'maxSalary']
      },
      verification_complete: {
        type: 'system',
        template: 'Hi {name}, your documents are verified! You can now apply for verified jobs. Visit empower.com',
        variables: ['name']
      }
    };

    // Function to send SMS using SMS provider API
    const sendSMS = async (phone: string, text: string): Promise<{ success: boolean; messageId?: string; error?: string }> => {
      try {
        // Example implementation for MSG91 (popular in India)
        // Replace with your preferred SMS provider
        const smsData = {
          sender: SMS_SENDER_ID,
          route: '4', // Transactional route
          country: '91', // India country code
          sms: [
            {
              message: text,
              to: [phone.startsWith('+91') ? phone.substring(3) : phone]
            }
          ]
        };

        // In production, you would make actual API call to SMS provider
        // For demo, we'll simulate SMS sending
        console.log(`SMS would be sent to ${phone}: ${text}`);
        
        // Simulate API response
        const success = Math.random() > 0.1; // 90% success rate for demo
        
        if (success) {
          return {
            success: true,
            messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          };
        } else {
          return {
            success: false,
            error: 'SMS delivery failed'
          };
        }
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    };

    // Function to format SMS message with template
    const formatSMSMessage = (templateType: string, data: any): string => {
      const template = smsTemplates[templateType];
      if (!template) {
        return message; // Return original message if no template found
      }

      let formattedMessage = template.template;
      template.variables.forEach(variable => {
        const value = data[variable] || '';
        formattedMessage = formattedMessage.replace(`{${variable}}`, value);
      });

      return formattedMessage;
    };

    // Function to get users for bulk notifications
    const getUsersForBulkNotification = async (filters: any): Promise<any[]> => {
      let query = supabase
        .from('profiles')
        .select('id, first_name, phone, location, user_type')
        .eq('is_active', true);

      if (filters.userType) {
        query = query.eq('user_type', filters.userType);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    };

    switch (action) {
      case 'send_notification': {
        if (!userId && !user?.id) {
          throw new Error('User ID is required');
        }

        const targetUserId = userId || user?.id;

        // Create in-app notification
        const { data: notification, error } = await supabase
          .from('notifications')
          .insert({
            user_id: targetUserId,
            title: title || 'Notification',
            message,
            type: type || 'system',
            action_url: actionUrl
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to create notification: ${error.message}`);
        }

        // Get user's phone number for SMS if they prefer SMS notifications
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('phone, first_name, subscription_type')
          .eq('id', targetUserId)
          .single();

        // Send SMS for critical notifications or for users who prefer SMS
        const criticalTypes = ['payment', 'job_match', 'verification'];
        if (userProfile?.phone && (criticalTypes.includes(type || '') || userProfile.subscription_type === 'sms_only')) {
          const smsText = formatSMSMessage(type || 'system', {
            name: userProfile.first_name || 'User',
            message: message.substring(0, 100), // Limit SMS length
            supportNumber: '1800-123-4567'
          });

          const smsResult = await sendSMS(userProfile.phone, smsText);
          
          // Log SMS status
          await supabase
            .from('sms_notifications')
            .insert({
              phone_number: userProfile.phone,
              message: smsText,
              status: smsResult.success ? 'sent' : 'failed',
              sent_at: smsResult.success ? new Date().toISOString() : null
            });
        }

        return new Response(
          JSON.stringify({
            success: true,
            notificationId: notification.id,
            message: 'Notification sent successfully'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'send_sms': {
        if (!phoneNumber || !message) {
          throw new Error('Phone number and message are required');
        }

        const smsResult = await sendSMS(phoneNumber, message);

        // Log SMS
        await supabase
          .from('sms_notifications')
          .insert({
            phone_number: phoneNumber,
            message,
            status: smsResult.success ? 'sent' : 'failed',
            sent_at: smsResult.success ? new Date().toISOString() : null
          });

        return new Response(
          JSON.stringify({
            success: smsResult.success,
            messageId: smsResult.messageId,
            error: smsResult.error
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'send_bulk_sms': {
        if (!message) {
          throw new Error('Message is required');
        }

        let targetUsers: any[] = [];

        if (phoneNumbers && phoneNumbers.length > 0) {
          // Send to specific phone numbers
          targetUsers = phoneNumbers.map(phone => ({ phone }));
        } else if (filters) {
          // Send to users based on filters
          targetUsers = await getUsersForBulkNotification(filters);
        } else {
          throw new Error('Either phone numbers or filters are required');
        }

        const results = [];
        for (const userData of targetUsers) {
          if (!userData.phone) continue;

          const formattedMessage = formatSMSMessage(type || 'marketing', {
            name: userData.first_name || 'User',
            location: userData.location || 'your area',
            category: filters?.categories?.[0] || 'various',
            maxSalary: '1500',
            supportNumber: '1800-123-4567',
            ...userData
          });

          const smsResult = await sendSMS(userData.phone, formattedMessage);
          
          // Log SMS
          await supabase
            .from('sms_notifications')
            .insert({
              phone_number: userData.phone,
              message: formattedMessage,
              status: smsResult.success ? 'sent' : 'failed',
              sent_at: smsResult.success ? new Date().toISOString() : null
            });

          results.push({
            phone: userData.phone,
            success: smsResult.success,
            error: smsResult.error
          });

          // Add delay between SMS to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;

        return new Response(
          JSON.stringify({
            success: true,
            totalSent: successCount,
            totalFailed: failureCount,
            results
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'mark_read': {
        if (!notificationId) {
          throw new Error('Notification ID is required');
        }

        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notificationId)
          .eq('user_id', user?.id); // Ensure user can only mark their own notifications

        if (error) {
          throw new Error(`Failed to mark notification as read: ${error.message}`);
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Notification marked as read'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_notifications': {
        if (!user?.id) {
          throw new Error('Authentication required');
        }

        const { data: notifications, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          throw new Error(`Failed to fetch notifications: ${error.message}`);
        }

        // Count unread notifications
        const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

        return new Response(
          JSON.stringify({
            success: true,
            notifications: notifications || [],
            unreadCount
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Notification system error:', error);
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

/* Helpful SMS templates for Mee Seva center operators:

For illiterate users, Mee Seva operators can use these voice scripts:

1. Job Alert (in local language):
"Namaste, aapke liye nayi naukri mili hai. [Job details]. Zyada jaankari ke liye humse sampark karein."

2. Payment Notification:
"Aapko [amount] rupaye mil gaye hain. Paisa aapke account mein aa gaya hai."

3. Application Status:
"Aapka job application accept ho gaya hai. Kaam ki shuruat [date] se hai."

Additional SQL functions to add:

-- Function to send job alerts to nearby workers
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

*/