
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Briefcase } from 'lucide-react';

const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-in-view');
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up as a job seeker or employer and complete your profile with relevant details.',
      role: 'Both',
      detailedInfo: 'Your profile is your professional showcase. Include skills, experience, and what makes you unique.',
    },
    {
      number: '02',
      title: 'Post or Find Jobs',
      description: 'Employers post job opportunities, while job seekers search or receive auto-matched positions.',
      role: 'Both',
      detailedInfo: 'Use our advanced AI-powered search to find perfect job matches or create compelling job listings.',
      actionLink: '/post-job',
      actionText: 'Post a Job',
    },
    {
      number: '03',
      title: 'Secure Payment Deposit',
      description: 'Employers deposit payment into our secure escrow system before work begins.',
      role: 'Employer',
      detailedInfo: 'Ensures trust and security. Payment is held until job completion and mutual satisfaction.',
    },
    {
      number: '04',
      title: 'Complete the Work',
      description: 'Job seekers complete the assigned tasks within the agreed timeline.',
      role: 'Job Seeker',
      detailedInfo: 'Deliver high-quality work, communicate effectively, and meet project milestones.',
    },
    {
      number: '05',
      title: 'Confirm & Release Payment',
      description: 'Employer confirms job completion, triggering the payment release to the worker.',
      role: 'Both',
      detailedInfo: 'After successful job completion, payment is automatically released from escrow.',
    },
    {
      number: '06',
      title: 'Leave Reviews',
      description: 'Both parties leave feedback to build credibility and improve the platform experience.',
      role: 'Both',
      detailedInfo: 'Honest, constructive reviews help build trust and improve future job matches.',
    },
  ];

  return (
    <section className="section-padding bg-secondary/30" ref={sectionRef}>
      <div className="text-center mb-16">
        <div className="animate-in-view">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            Simple Process
          </span>
        </div>
        <h2 className="animate-in-view heading-lg mb-6">How Empower Works</h2>
        <p className="animate-in-view body-md text-muted-foreground max-w-2xl mx-auto">
          Our streamlined process connects job seekers with employers through a secure and transparent workflow.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <Dialog key={step.number}>
            <div 
              className={`animate-in-view delay-[${index * 100}ms] bg-white rounded-lg p-6 shadow-sm border border-border relative overflow-hidden group hover:shadow-md transition-all duration-300`}
            >
              <div className="absolute -right-4 -top-4 text-7xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors duration-300">
                {step.number}
              </div>
              
              <div className="relative z-10">
                <div className="mb-4">
                  <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full 
                    ${step.role === 'Both' ? 'bg-purple-100 text-purple-700' : 
                    step.role === 'Employer' ? 'bg-blue-100 text-blue-700' : 
                    'bg-green-100 text-green-700'}`}
                  >
                    {step.role}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                
                <div className="mt-4 flex space-x-2">
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="group">
                      Learn More 
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </DialogTrigger>
                  
                  {step.actionLink && (
                    <Link to={step.actionLink}>
                      <Button size="sm">
                        {step.actionText}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>{step.title}</DialogTitle>
                <DialogDescription>Details about {step.title.toLowerCase()}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <p>{step.detailedInfo}</p>
                </div>
                
                {step.role === 'Both' && (
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Pro Tips</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>Complete your profile thoroughly</li>
                      <li>Use AI-powered job matching</li>
                      <li>Provide detailed job descriptions</li>
                    </ul>
                  </div>
                )}
                
                {step.actionLink && (
                  <div className="mt-2 pt-2 border-t">
                    <Link to={step.actionLink}>
                      <Button className="w-full">
                        {step.actionText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
      
      <div className="mt-16 text-center animate-in-view">
        <Link to="/post-job">
          <Button size="lg" className="group">
            <Briefcase className="mr-2 h-5 w-5" />
            Post a Job Now
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HowItWorks;
