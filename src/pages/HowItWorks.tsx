
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HowItWorksContent from '@/components/home/HowItWorks';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowRight, Check } from 'lucide-react';

const HowItWorks = () => {
  const faqs = [
    {
      question: "How does the payment protection work?",
      answer: "Empower uses an escrow system for all payments. When an employer hires a worker, they deposit the payment into our secure system. The funds are only released to the worker once the job is completed and the employer confirms satisfaction. This protects both parties and ensures fair payment for completed work."
    },
    {
      question: "What happens if there's a dispute?",
      answer: "If there's a disagreement between the worker and employer, our dispute resolution team will review the case. They'll examine the job description, communications, and any work completed to make a fair determination. Both parties will have the opportunity to present their case before a final decision is made."
    },
    {
      question: "How are workers verified?",
      answer: "Workers on our platform undergo a verification process that includes identity verification, skills assessment, and reference checks. We also maintain a rating system based on employer feedback to help maintain quality standards and build trust."
    },
    {
      question: "What fees does Empower charge?",
      answer: "Empower charges a small percentage-based service fee on completed jobs. Employers pay a fee of 5% of the total job value, while workers pay 10%. These fees cover platform maintenance, payment processing, customer support, and dispute resolution services."
    },
    {
      question: "Can I hire the same worker for multiple jobs?",
      answer: "Yes, you can hire the same worker for multiple jobs. If you've had a positive experience with a worker, you can directly invite them to your future job postings. We encourage building long-term working relationships while still providing the security of our platform."
    },
    {
      question: "How do I find the right workers for my job?",
      answer: "You can post detailed job requirements and browse through worker profiles with skill tags. Our AI-powered matching system will also suggest suitable candidates based on your job description. Additionally, you can review workers' ratings and feedback from previous employers to make informed hiring decisions."
    }
  ];

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
          
          {/* Employer Section */}
          <div className="mt-24 mb-16">
            <div className="text-center mb-12">
              <h2 className="heading-md mb-4">For Employers</h2>
              <p className="body-md text-muted-foreground max-w-2xl mx-auto">
                Hire qualified workers with confidence through our secure platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
                <div className="bg-blue-100 text-blue-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Post Detailed Jobs</h3>
                <p className="text-muted-foreground mb-4">
                  Create comprehensive job listings with clear requirements, responsibilities, and compensation to attract the right candidates.
                </p>
                <Link to="/post-job">
                  <Button variant="outline" size="sm" className="group">
                    Post a Job
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
                <div className="bg-blue-100 text-blue-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Verify Work Completion</h3>
                <p className="text-muted-foreground mb-4">
                  Review the completed work and approve payment release once you're satisfied with the quality and deliverables.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
                <div className="bg-blue-100 text-blue-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Build Reliable Teams</h3>
                <p className="text-muted-foreground mb-4">
                  Identify top performers through ratings and reviews, and build a network of reliable workers for your future projects.
                </p>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-24 mb-16">
            <div className="text-center mb-12">
              <h2 className="heading-md mb-4">Frequently Asked Questions</h2>
              <p className="body-md text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about using the Empower platform.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-24 mb-8 bg-primary/5 p-8 rounded-lg border border-primary/20 text-center">
            <h2 className="heading-md mb-4">Ready to Get Started?</h2>
            <p className="body-md text-muted-foreground max-w-2xl mx-auto mb-6">
              Join thousands of employers and workers already using Empower to connect, work, and grow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/post-job">
                <Button size="lg">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Post a Job
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="lg">
                  Find Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
