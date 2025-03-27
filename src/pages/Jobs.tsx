
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JobList from '@/components/jobs/JobList';
import { Search as SearchIcon, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Jobs = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="heading-lg mb-4">Find Your Next Job</h1>
                <p className="body-md text-muted-foreground max-w-3xl">
                  Browse through hundreds of gig opportunities, part-time jobs, and short-term contracts across various industries.
                </p>
              </div>
              {user && (
                <div className="mt-4 md:mt-0">
                  <Link to="/post-job">
                    <Button className="whitespace-nowrap">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Post a Job
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* AI Search Banner */}
          <div className="mb-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0 md:mr-6">
                <h3 className="text-lg font-medium mb-2">Try our AI-Powered Job Search</h3>
                <p className="text-muted-foreground">
                  Describe what you're looking for in natural language and our AI will find the perfect matches.
                </p>
              </div>
              <Link to="/ai-job-search">
                <Button className="whitespace-nowrap">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Try AI Search
                </Button>
              </Link>
            </div>
          </div>
          
          {!user && (
            <div className="mb-8 p-6 bg-secondary rounded-lg border border-border">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <h3 className="text-lg font-medium mb-2">Are you an employer?</h3>
                  <p className="text-muted-foreground">
                    Post a job listing to reach thousands of qualified workers.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Link to="/auth">
                    <Button variant="outline" className="whitespace-nowrap">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/post-job">
                    <Button className="whitespace-nowrap">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Post a Job
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          <JobList />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Jobs;
