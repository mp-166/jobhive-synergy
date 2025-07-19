import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { escrowPaymentAPI, utils } from '@/lib/api';
import { CreditCard, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface PaymentManagerProps {
  job: any;
  userRole: 'employer' | 'worker';
  onPaymentUpdate?: () => void;
}

export default function PaymentManager({ job, userRole, onPaymentUpdate }: PaymentManagerProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(job.total_budget || 0);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [disputeReason, setDisputeReason] = useState('');

  const commissionInfo = utils.calculateCommission(paymentAmount);
  const escrowPayment = job.escrow_payments?.[0];

  const handleDepositPayment = async () => {
    try {
      setIsLoading(true);
      await escrowPaymentAPI.deposit(
        job.id,
        job.selected_worker_id || '', // You'll need to track selected worker
        paymentAmount,
        paymentMethod
      );
      
      toast({
        title: "Payment Deposited",
        description: `₹${paymentAmount} has been securely deposited. Workers will be paid after job completion.`,
      });
      
      onPaymentUpdate?.();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReleasePayment = async () => {
    try {
      setIsLoading(true);
      await escrowPaymentAPI.release(job.id);
      
      toast({
        title: "Payment Released",
        description: "Payment has been released to the worker successfully.",
      });
      
      onPaymentUpdate?.();
    } catch (error) {
      toast({
        title: "Release Failed",
        description: error instanceof Error ? error.message : "Failed to release payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefundPayment = async () => {
    try {
      setIsLoading(true);
      await escrowPaymentAPI.refund(job.id, disputeReason || 'Job not completed as expected');
      
      toast({
        title: "Refund Processed",
        description: "Your refund has been processed. A small processing fee has been deducted.",
      });
      
      onPaymentUpdate?.();
    } catch (error) {
      toast({
        title: "Refund Failed",
        description: error instanceof Error ? error.message : "Failed to process refund",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispute = async () => {
    try {
      setIsLoading(true);
      await escrowPaymentAPI.dispute(job.id, disputeReason);
      
      toast({
        title: "Dispute Raised",
        description: "Your dispute has been submitted. Our team will review it within 24 hours.",
      });
      
      onPaymentUpdate?.();
    } catch (error) {
      toast({
        title: "Dispute Failed",
        description: error instanceof Error ? error.message : "Failed to raise dispute",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'secondary', icon: CreditCard, label: 'Payment Pending' },
      escrowed: { color: 'default', icon: Shield, label: 'Payment Secured' },
      released: { color: 'secondary', icon: CheckCircle, label: 'Payment Released' },
      refunded: { color: 'destructive', icon: XCircle, label: 'Payment Refunded' },
      disputed: { color: 'destructive', icon: AlertTriangle, label: 'Under Dispute' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.color as any} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Management</span>
          {escrowPayment && getPaymentStatusBadge(escrowPayment.status)}
        </CardTitle>
        <CardDescription>
          Secure escrow payment system ensures safe transactions for both parties
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!escrowPayment && userRole === 'employer' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Commission Breakdown</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium">{utils.formatCurrency(commissionInfo.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee ({commissionInfo.platformFeePercentage}%):</span>
                  <span className="font-medium">{utils.formatCurrency(commissionInfo.platformFee)}</span>
                </div>
                <div className="flex justify-between border-t border-blue-300 pt-2">
                  <span>Worker Receives:</span>
                  <span className="font-bold">{utils.formatCurrency(commissionInfo.workerAmount)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="amount">Payment Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  min="100"
                  step="100"
                />
              </div>

              <div>
                <Label htmlFor="method">Payment Method</Label>
                <select
                  id="method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="net_banking">Net Banking</option>
                </select>
              </div>

              <Button 
                onClick={handleDepositPayment} 
                disabled={isLoading || paymentAmount < 100}
                className="w-full"
              >
                <Shield className="w-4 h-4 mr-2" />
                {isLoading ? 'Processing...' : `Deposit ${utils.formatCurrency(paymentAmount)}`}
              </Button>
            </div>
          </div>
        )}

        {escrowPayment && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Payment Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium">{utils.formatCurrency(escrowPayment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span className="font-medium">{utils.formatCurrency(escrowPayment.platform_fee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Worker Amount:</span>
                  <span className="font-medium">{utils.formatCurrency(escrowPayment.amount - escrowPayment.platform_fee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium capitalize">{escrowPayment.status.replace('_', ' ')}</span>
                </div>
                {escrowPayment.escrowed_at && (
                  <div className="flex justify-between">
                    <span>Escrowed At:</span>
                    <span className="font-medium">{new Date(escrowPayment.escrowed_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {escrowPayment.status === 'escrowed' && userRole === 'employer' && job.status === 'completed' && (
              <div className="flex gap-2">
                <Button onClick={handleReleasePayment} disabled={isLoading} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Release Payment
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" disabled={isLoading}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Request Refund
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Request Refund</AlertDialogTitle>
                      <AlertDialogDescription>
                        Please provide a reason for the refund request. A 2% processing fee will be charged.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Textarea
                      placeholder="Reason for refund..."
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRefundPayment}>
                        Request Refund
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {escrowPayment.status === 'escrowed' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isLoading} className="w-full">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Raise Dispute
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Raise Payment Dispute</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will freeze the payment until our team resolves the dispute. Please provide details about the issue.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Textarea
                    placeholder="Describe the issue in detail..."
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDispute}>
                      Raise Dispute
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}

        {escrowPayment?.status === 'released' && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center text-green-800">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">Payment Completed Successfully</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              The payment has been released and the worker has been paid.
            </p>
          </div>
        )}

        {escrowPayment?.status === 'disputed' && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center text-red-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="font-medium">Dispute Under Review</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              Our team is reviewing the dispute. You will be notified once it's resolved.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}