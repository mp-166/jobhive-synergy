import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PaymentManager from '@/components/payment/PaymentManager';
import VerificationDashboard from '@/components/verification/VerificationDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { utils } from '@/lib/api';
import { 
  Zap, 
  Shield, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Globe,
  Smartphone,
  Star,
  Clock,
  Calculator
} from 'lucide-react';

// Sample data for demo
const sampleJob = {
  id: 'demo-job-1',
  title: 'Rice Harvesting Workers Needed',
  description: 'Need 10 experienced workers for rice harvesting in Punjab.',
  location: 'Punjab, India',
  salary_min: 800,
  salary_max: 1200,
  total_budget: 12000,
  category: 'Agriculture',
  status: 'completed',
  escrow_payments: [
    {
      id: 'payment-1',
      amount: 12000,
      platform_fee: 1440,
      status: 'escrowed',
      payment_method: 'bank_transfer',
      escrowed_at: new Date().toISOString(),
    }
  ]
};

const platformStats = {
  totalUsers: 25000,
  totalJobs: 5400,
  totalPayments: 8200000,
  avgRating: 4.7,
  successRate: 95,
};

export default function Demo() {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [currentUser] = useState('demo-user-123');

  const commissionInfo = utils.calculateCommission(selectedAmount);

  const handleDemoAction = (feature: string) => {
    toast({
      title: `${feature} Demo`,
      description: `This is a demonstration of the ${feature} feature. In the live version, this would perform the actual action.`,
    });
  };

  const testAmounts = [1000, 5000, 12000, 25000, 50000];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🚀 Empower Platform Demo
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the complete gig work platform with intelligent job matching, 
              secure escrow payments, document verification, and SMS notifications for all users.
            </p>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{platformStats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{platformStats.totalJobs.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Jobs Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">₹{(platformStats.totalPayments / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-gray-600">Payments Processed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{platformStats.avgRating}</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{platformStats.successRate}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="commission" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="commission">Commission Calculator</TabsTrigger>
              <TabsTrigger value="payment">Payment System</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="features">Platform Features</TabsTrigger>
            </TabsList>

            {/* Commission Calculator */}
            <TabsContent value="commission" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Commission Structure Calculator
                  </CardTitle>
                  <CardDescription>
                    Test our updated commission structure: 12% up to ₹5,000 • 8% up to ₹25,000 • 5% above ₹25,000
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Test Amount (₹)</label>
                        <div className="grid grid-cols-3 gap-2">
                          {testAmounts.map((amount) => (
                            <Button
                              key={amount}
                              variant={selectedAmount === amount ? 'default' : 'outline'}
                              onClick={() => setSelectedAmount(amount)}
                              className="text-sm"
                            >
                              ₹{amount.toLocaleString()}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Custom Amount</label>
                        <input
                          type="number"
                          value={selectedAmount}
                          onChange={(e) => setSelectedAmount(Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          min="100"
                          step="100"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-4">Commission Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-800">Job Amount:</span>
                          <span className="font-semibold">{utils.formatCurrency(commissionInfo.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-800">Platform Fee ({commissionInfo.platformFeePercentage}%):</span>
                          <span className="font-semibold text-red-600">-{utils.formatCurrency(commissionInfo.platformFee)}</span>
                        </div>
                        <div className="flex justify-between border-t border-blue-200 pt-3">
                          <span className="font-bold text-blue-900">Worker Receives:</span>
                          <span className="font-bold text-green-600">{utils.formatCurrency(commissionInfo.workerAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Commission Tiers</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">12%</Badge>
                        <span>Up to ₹5,000</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">8%</Badge>
                        <span>₹5,001 - ₹25,000</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">5%</Badge>
                        <span>Above ₹25,000</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment System Demo */}
            <TabsContent value="payment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Escrow Payment System Demo</CardTitle>
                  <CardDescription>
                    Experience our secure payment system that protects both employers and workers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentManager 
                    job={sampleJob}
                    userRole="employer"
                    onPaymentUpdate={() => handleDemoAction('Payment Update')}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Verification Demo */}
            <TabsContent value="verification" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Verification Demo</CardTitle>
                  <CardDescription>
                    See how our verification system builds trust and security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VerificationDashboard userId={currentUser} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Platform Features */}
            <TabsContent value="features" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      AI Job Matching
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Intelligent matching based on skills, location, and preferences with 40% skill weighting.
                    </p>
                    <Button 
                      onClick={() => handleDemoAction('AI Job Matching')}
                      className="w-full"
                    >
                      Find Matches
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      Secure Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Escrow system with automatic fee calculation and dispute resolution.
                    </p>
                    <Button 
                      onClick={() => handleDemoAction('Secure Payments')}
                      className="w-full"
                    >
                      View Payment
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      Document Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Auto-verification with government API integration and manual review.
                    </p>
                    <Button 
                      onClick={() => handleDemoAction('Document Verification')}
                      className="w-full"
                    >
                      Verify Documents
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-purple-500" />
                      SMS Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Reach non-tech users with SMS alerts and Mee Seva center integration.
                    </p>
                    <Button 
                      onClick={() => handleDemoAction('SMS Notifications')}
                      className="w-full"
                    >
                      Send SMS
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      Subscription Plans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Multiple tiers: Basic (₹299), Premium (₹599), Enterprise (₹1999).
                    </p>
                    <Button 
                      onClick={() => handleDemoAction('Subscription Plans')}
                      className="w-full"
                    >
                      View Plans
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-500" />
                      Multi-Language Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Support for Hindi, Telugu, Tamil, and other regional languages.
                    </p>
                    <Button 
                      onClick={() => handleDemoAction('Multi-Language Support')}
                      className="w-full"
                    >
                      Change Language
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Use Cases */}
              <Card>
                <CardHeader>
                  <CardTitle>Real-World Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-700">🌾 Agriculture</h4>
                      <p className="text-sm text-gray-600">
                        Rice mill needs 10 workers for harvesting. Workers get matched, payment escrowed, 
                        work completed, payment released with 12% platform fee.
                      </p>
                      <div className="text-xs bg-green-50 p-2 rounded">
                        <strong>Example:</strong> ₹12,000 job → ₹1,440 fee → ₹10,560 to workers
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-700">🚗 Transportation</h4>
                      <p className="text-sm text-gray-600">
                        Need driver for 3-month coaching. Driver with verified license gets matched, 
                        monthly payments through escrow system.
                      </p>
                      <div className="text-xs bg-blue-50 p-2 rounded">
                        <strong>Example:</strong> ₹30,000 job → ₹1,500 fee (5%) → ₹28,500 to driver
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-purple-700">👨‍🍳 Hospitality</h4>
                      <p className="text-sm text-gray-600">
                        Wedding chef needed for 3 days. Chef gets matched based on cuisine skills, 
                        payment secured in escrow until event completion.
                      </p>
                      <div className="text-xs bg-purple-50 p-2 rounded">
                        <strong>Example:</strong> ₹8,000 job → ₹640 fee (8%) → ₹7,360 to chef
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Call to Action */}
          <div className="text-center mt-16 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Launch Your MVP?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              This demo shows all the core features working together. The backend is ready for deployment 
              with real payment processing, SMS integration, and document verification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => handleDemoAction('Deploy Backend')}>
                Deploy Backend
              </Button>
              <Button size="lg" variant="outline" onClick={() => handleDemoAction('Test Integration')}>
                Test Integration
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}