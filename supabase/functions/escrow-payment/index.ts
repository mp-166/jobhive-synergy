import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EscrowPaymentRequest {
  action: 'deposit' | 'release' | 'refund' | 'dispute';
  jobId: string;
  workerId?: string;
  amount?: number;
  paymentMethod?: string;
  reason?: string;
}

interface PaymentCalculation {
  totalAmount: number;
  platformFeePercentage: number;
  platformFee: number;
  workerAmount: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { action, jobId, workerId, amount, paymentMethod, reason }: EscrowPaymentRequest = await req.json();

    // Calculate platform fee based on amount
    const calculatePlatformFee = (amount: number): PaymentCalculation => {
      let feePercentage = 5; // Default 5%
      
      // Dynamic fee structure based on amount
      if (amount <= 1000) feePercentage = 3;
      else if (amount <= 5000) feePercentage = 4;
      else if (amount <= 15000) feePercentage = 5;
      else feePercentage = 6;

      const platformFee = Math.round((amount * feePercentage) / 100);
      const workerAmount = amount - platformFee;

      return {
        totalAmount: amount,
        platformFeePercentage: feePercentage,
        platformFee,
        workerAmount
      };
    };

    switch (action) {
      case 'deposit': {
        // Employer deposits money for a job
        if (!amount || !paymentMethod) {
          throw new Error('Amount and payment method required for deposit');
        }

        // Get job details
        const { data: job, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (jobError || !job) {
          throw new Error('Job not found');
        }

        if (job.employer_id !== user.id) {
          throw new Error('Only job owner can deposit payment');
        }

        const feeCalculation = calculatePlatformFee(amount);

        // Create escrow payment record
        const { data: escrowPayment, error: escrowError } = await supabase
          .from('escrow_payments')
          .insert({
            job_id: jobId,
            employer_id: user.id,
            worker_id: workerId,
            amount: feeCalculation.totalAmount,
            platform_fee: feeCalculation.platformFee,
            status: 'escrowed',
            payment_method: paymentMethod,
            escrowed_at: new Date().toISOString()
          })
          .select()
          .single();

        if (escrowError) {
          throw new Error(`Failed to create escrow payment: ${escrowError.message}`);
        }

        // Update job payment status
        await supabase
          .from('jobs')
          .update({ payment_status: 'escrowed' })
          .eq('id', jobId);

        // Create transaction record
        await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            job_id: jobId,
            type: 'payment',
            amount: -feeCalculation.totalAmount,
            description: `Payment deposited for job: ${job.title}`,
            payment_method: paymentMethod,
            transaction_id: escrowPayment.id
          });

        return new Response(
          JSON.stringify({
            success: true,
            data: escrowPayment,
            feeCalculation
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'release': {
        // Release payment to worker after job completion
        const { data: escrowPayment, error: escrowError } = await supabase
          .from('escrow_payments')
          .select('*')
          .eq('job_id', jobId)
          .eq('status', 'escrowed')
          .single();

        if (escrowError || !escrowPayment) {
          throw new Error('No escrowed payment found for this job');
        }

        if (escrowPayment.employer_id !== user.id) {
          throw new Error('Only employer can release payment');
        }

        // Update escrow payment status
        const { error: updateError } = await supabase
          .from('escrow_payments')
          .update({
            status: 'released',
            released_at: new Date().toISOString()
          })
          .eq('id', escrowPayment.id);

        if (updateError) {
          throw new Error(`Failed to update escrow payment: ${updateError.message}`);
        }

        // Update job payment status
        await supabase
          .from('jobs')
          .update({ 
            payment_status: 'released',
            status: 'completed'
          })
          .eq('id', jobId);

        // Create transaction records
        const workerAmount = escrowPayment.amount - escrowPayment.platform_fee;

        // Worker earning
        await supabase
          .from('transactions')
          .insert({
            user_id: escrowPayment.worker_id,
            job_id: jobId,
            type: 'earning',
            amount: workerAmount,
            description: `Payment received for completed job`,
            transaction_id: escrowPayment.id
          });

        // Platform commission
        await supabase
          .from('transactions')
          .insert({
            user_id: escrowPayment.employer_id,
            job_id: jobId,
            type: 'commission',
            amount: escrowPayment.platform_fee,
            description: `Platform fee for job completion`,
            transaction_id: escrowPayment.id
          });

        // Update worker's total earnings and completed jobs
        await supabase.rpc('update_worker_stats', {
          worker_id: escrowPayment.worker_id,
          earnings: workerAmount,
          jobs_completed: 1
        });

        // Send notification to worker
        await supabase
          .from('notifications')
          .insert({
            user_id: escrowPayment.worker_id,
            title: 'Payment Released',
            message: `You've received ₹${workerAmount} for completing the job`,
            type: 'payment',
            action_url: `/jobs/${jobId}`
          });

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Payment released successfully',
            workerAmount,
            platformFee: escrowPayment.platform_fee
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'refund': {
        // Refund payment to employer if worker doesn't perform
        const { data: escrowPayment, error: escrowError } = await supabase
          .from('escrow_payments')
          .select('*')
          .eq('job_id', jobId)
          .eq('status', 'escrowed')
          .single();

        if (escrowError || !escrowPayment) {
          throw new Error('No escrowed payment found for this job');
        }

        if (escrowPayment.employer_id !== user.id) {
          throw new Error('Only employer can request refund');
        }

        // Calculate refund amount (employer still pays minimal platform fee)
        const refundFeePercentage = 2; // 2% platform fee for refunds
        const refundFee = Math.round((escrowPayment.amount * refundFeePercentage) / 100);
        const refundAmount = escrowPayment.amount - refundFee;

        // Update escrow payment status
        const { error: updateError } = await supabase
          .from('escrow_payments')
          .update({
            status: 'refunded',
            platform_fee: refundFee,
            refunded_at: new Date().toISOString()
          })
          .eq('id', escrowPayment.id);

        if (updateError) {
          throw new Error(`Failed to update escrow payment: ${updateError.message}`);
        }

        // Update job status
        await supabase
          .from('jobs')
          .update({ 
            payment_status: 'refunded',
            status: 'cancelled'
          })
          .eq('id', jobId);

        // Create transaction records
        await supabase
          .from('transactions')
          .insert({
            user_id: escrowPayment.employer_id,
            job_id: jobId,
            type: 'refund',
            amount: refundAmount,
            description: `Refund for cancelled job (${reason || 'Worker did not perform'})`,
            transaction_id: escrowPayment.id
          });

        // Platform refund fee
        await supabase
          .from('transactions')
          .insert({
            user_id: escrowPayment.employer_id,
            job_id: jobId,
            type: 'commission',
            amount: refundFee,
            description: `Platform fee for refund processing`,
            transaction_id: escrowPayment.id
          });

        // Send notifications
        await supabase
          .from('notifications')
          .insert([
            {
              user_id: escrowPayment.employer_id,
              title: 'Payment Refunded',
              message: `Refund of ₹${refundAmount} processed for cancelled job`,
              type: 'payment',
              action_url: `/jobs/${jobId}`
            },
            {
              user_id: escrowPayment.worker_id,
              title: 'Job Cancelled',
              message: `Job has been cancelled and payment refunded to employer`,
              type: 'system',
              action_url: `/jobs/${jobId}`
            }
          ]);

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Payment refunded successfully',
            refundAmount,
            refundFee
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'dispute': {
        // Handle payment disputes
        if (!reason) {
          throw new Error('Reason required for dispute');
        }

        const { data: escrowPayment, error: escrowError } = await supabase
          .from('escrow_payments')
          .select('*')
          .eq('job_id', jobId)
          .eq('status', 'escrowed')
          .single();

        if (escrowError || !escrowPayment) {
          throw new Error('No escrowed payment found for this job');
        }

        // Update escrow payment status
        await supabase
          .from('escrow_payments')
          .update({ status: 'disputed' })
          .eq('id', escrowPayment.id);

        // Create dispute record
        const { data: dispute, error: disputeError } = await supabase
          .from('disputes')
          .insert({
            job_id: jobId,
            raised_by: user.id,
            against_user: escrowPayment.employer_id === user.id ? escrowPayment.worker_id : escrowPayment.employer_id,
            reason: reason,
            status: 'open'
          })
          .select()
          .single();

        if (disputeError) {
          throw new Error(`Failed to create dispute: ${disputeError.message}`);
        }

        // Send notifications to both parties
        await supabase
          .from('notifications')
          .insert([
            {
              user_id: escrowPayment.employer_id,
              title: 'Payment Dispute Raised',
              message: `A dispute has been raised for this job. Our team will review it.`,
              type: 'system',
              action_url: `/disputes/${dispute.id}`
            },
            {
              user_id: escrowPayment.worker_id,
              title: 'Payment Dispute Raised',
              message: `A dispute has been raised for this job. Our team will review it.`,
              type: 'system',
              action_url: `/disputes/${dispute.id}`
            }
          ]);

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Dispute raised successfully',
            disputeId: dispute.id
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Escrow payment error:', error);
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

/* Custom SQL functions to be added to the database:

-- Function to update worker statistics
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

*/