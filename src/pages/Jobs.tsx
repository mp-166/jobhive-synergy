
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JobList from '@/components/jobs/JobList';

const Jobs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="heading-lg mb-4">Find Your Next Job</h1>
            <p className="body-md text-muted-foreground max-w-3xl">
              Browse through hundreds of gig opportunities, part-time jobs, and short-term contracts across various industries.
            </p>
          </div>
          
          <JobList />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Jobs;
