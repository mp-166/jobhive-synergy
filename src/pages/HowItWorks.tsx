
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HowItWorksContent from '@/components/home/HowItWorks';

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="heading-lg mb-4">How Empower Works</h1>
            <p className="body-md text-muted-foreground max-w-3xl mx-auto">
              Learn about our streamlined process connecting job seekers with employers through 
              a secure and transparent workflow.
            </p>
          </div>
          
          <HowItWorksContent />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
