// API service functions for Empower Platform
import { supabase } from '@/integrations/supabase/client';

// Types for API requests and responses
export interface EscrowPaymentRequest {
  action: 'deposit' | 'release' | 'refund' | 'dispute';
  jobId: string;
  workerId?: string;
  amount?: number;
  paymentMethod?: string;
  reason?: string;
}

export interface JobMatchingRequest {
  action: 'find_matches' | 'auto_apply' | 'get_recommendations';
  jobId?: string;
  workerId?: string;
  filters?: {
    location?: string;
    categories?: string[];
    minSalary?: number;
    maxSalary?: number;
    urgencyLevel?: string;
  };
}

export interface VerificationRequest {
  action: 'submit_document' | 'verify_document' | 'get_verification_status';
  documentType?: 'aadhar' | 'pan' | 'driving_license' | 'bank_statement' | 'address_proof';
  documentUrl?: string;
  verificationId?: string;
  verificationStatus?: 'verified' | 'rejected';
  notes?: string;
}

export interface NotificationRequest {
  action: 'send_notification' | 'send_sms' | 'mark_read' | 'get_notifications';
  userId?: string;
  title?: string;
  message: string;
  type?: 'job_match' | 'application' | 'payment' | 'review' | 'system';
  actionUrl?: string;
  phoneNumber?: string;
  notificationId?: string;
}

export interface SubscriptionRequest {
  action: 'create_subscription' | 'upgrade_subscription' | 'cancel_subscription' | 'get_subscription' | 'feature_job';
  planType?: 'basic' | 'premium' | 'enterprise';
  planDuration?: 'monthly' | 'quarterly' | 'yearly';
  paymentMethod?: string;
  jobId?: string;
  featureDuration?: number;
}

// Helper function to call Supabase Edge Functions
async function callEdgeFunction(functionName: string, data: any) {
  const { data: result, error } = await supabase.functions.invoke(functionName, {
    body: JSON.stringify(data),
  });

  if (error) {
    throw new Error(`API Error: ${error.message}`);
  }

  return result;
}

// Escrow Payment API
export const escrowPaymentAPI = {
  deposit: async (jobId: string, workerId: string, amount: number, paymentMethod: string) => {
    return callEdgeFunction('escrow-payment', {
      action: 'deposit',
      jobId,
      workerId,
      amount,
      paymentMethod,
    });
  },

  release: async (jobId: string) => {
    return callEdgeFunction('escrow-payment', {
      action: 'release',
      jobId,
    });
  },

  refund: async (jobId: string, reason: string) => {
    return callEdgeFunction('escrow-payment', {
      action: 'refund',
      jobId,
      reason,
    });
  },

  dispute: async (jobId: string, reason: string) => {
    return callEdgeFunction('escrow-payment', {
      action: 'dispute',
      jobId,
      reason,
    });
  },
};

// Job Matching API
export const jobMatchingAPI = {
  findMatches: async (filters?: JobMatchingRequest['filters']) => {
    return callEdgeFunction('job-matching', {
      action: 'find_matches',
      filters,
    });
  },

  autoApply: async (jobId: string) => {
    return callEdgeFunction('job-matching', {
      action: 'auto_apply',
      jobId,
    });
  },

  getRecommendations: async () => {
    return callEdgeFunction('job-matching', {
      action: 'get_recommendations',
    });
  },
};

// Verification System API
export const verificationAPI = {
  submitDocument: async (documentType: string, documentUrl: string) => {
    return callEdgeFunction('verification-system', {
      action: 'submit_document',
      documentType,
      documentUrl,
    });
  },

  getVerificationStatus: async () => {
    return callEdgeFunction('verification-system', {
      action: 'get_verification_status',
    });
  },

  verifyDocument: async (verificationId: string, status: 'verified' | 'rejected', notes?: string) => {
    return callEdgeFunction('verification-system', {
      action: 'verify_document',
      verificationId,
      verificationStatus: status,
      notes,
    });
  },
};

// Notification API
export const notificationAPI = {
  sendNotification: async (userId: string, title: string, message: string, type?: string, actionUrl?: string) => {
    return callEdgeFunction('notification-system', {
      action: 'send_notification',
      userId,
      title,
      message,
      type,
      actionUrl,
    });
  },

  sendSMS: async (phoneNumber: string, message: string) => {
    return callEdgeFunction('notification-system', {
      action: 'send_sms',
      phoneNumber,
      message,
    });
  },

  getNotifications: async () => {
    return callEdgeFunction('notification-system', {
      action: 'get_notifications',
    });
  },

  markAsRead: async (notificationId: string) => {
    return callEdgeFunction('notification-system', {
      action: 'mark_read',
      notificationId,
    });
  },
};

// Subscription API
export const subscriptionAPI = {
  createSubscription: async (planType: string, planDuration: string, paymentMethod: string) => {
    return callEdgeFunction('subscription-management', {
      action: 'create_subscription',
      planType,
      planDuration,
      paymentMethod,
    });
  },

  getSubscription: async () => {
    return callEdgeFunction('subscription-management', {
      action: 'get_subscription',
    });
  },

  upgradeSubscription: async (planType: string, planDuration: string) => {
    return callEdgeFunction('subscription-management', {
      action: 'upgrade_subscription',
      planType,
      planDuration,
    });
  },

  cancelSubscription: async () => {
    return callEdgeFunction('subscription-management', {
      action: 'cancel_subscription',
    });
  },

  featureJob: async (jobId: string, featureDuration: number) => {
    return callEdgeFunction('subscription-management', {
      action: 'feature_job',
      jobId,
      featureDuration,
    });
  },
};

// Enhanced database queries with new schema
export const databaseAPI = {
  // Get job with enhanced fields
  getJobWithDetails: async (jobId: string) => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        escrow_payments (*),
        job_applications (
          *,
          profiles (first_name, last_name, rating, verified)
        )
      `)
      .eq('id', jobId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's verification status
  getUserVerificationStatus: async (userId: string) => {
    const { data, error } = await supabase
      .from('document_verifications')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  // Get user's skills
  getUserSkills: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_skills')
      .select(`
        *,
        skills_catalog (name, category, verification_required)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  // Get transactions
  getUserTransactions: async (userId: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get job categories
  getJobCategories: async () => {
    const { data, error } = await supabase
      .from('job_categories')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    return data;
  },

  // Get skills catalog
  getSkillsCatalog: async () => {
    const { data, error } = await supabase
      .from('skills_catalog')
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create enhanced job
  createJob: async (jobData: any) => {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        ...jobData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update profile with enhanced fields
  updateProfile: async (userId: string, profileData: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Utility functions
export const utils = {
  // Calculate commission based on new rates
  calculateCommission: (amount: number) => {
    let feePercentage: number;
    if (amount <= 5000) feePercentage = 12;
    else if (amount <= 25000) feePercentage = 8;
    else feePercentage = 5;

    const platformFee = Math.round((amount * feePercentage) / 100);
    const workerAmount = amount - platformFee;

    return {
      totalAmount: amount,
      platformFeePercentage: feePercentage,
      platformFee,
      workerAmount,
    };
  },

  // Format currency in Indian Rupees
  formatCurrency: (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  },

  // Get verification level based on score
  getVerificationLevel: (score: number) => {
    if (score >= 80) return { level: 'fully_verified', color: 'green', label: 'Fully Verified' };
    if (score >= 50) return { level: 'partially_verified', color: 'yellow', label: 'Partially Verified' };
    if (score >= 25) return { level: 'basic_verified', color: 'orange', label: 'Basic Verified' };
    return { level: 'unverified', color: 'red', label: 'Unverified' };
  },
};

export default {
  escrowPaymentAPI,
  jobMatchingAPI,
  verificationAPI,
  notificationAPI,
  subscriptionAPI,
  databaseAPI,
  utils,
};