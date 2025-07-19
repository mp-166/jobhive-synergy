import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VerificationDashboard from '@/components/verification/VerificationDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Verification() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="heading-lg mb-4">Document Verification</h1>
            <p className="body-md text-muted-foreground">
              Complete your document verification to access all platform features and build trust with employers.
            </p>
          </div>
          
          <VerificationDashboard userId={user.id} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}