
import React, { useEffect, useRef } from 'react';

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
    },
    {
      number: '02',
      title: 'Post or Find Jobs',
      description: 'Employers post job opportunities, while job seekers search or receive auto-matched positions.',
      role: 'Both',
    },
    {
      number: '03',
      title: 'Secure Payment Deposit',
      description: 'Employers deposit payment into our secure escrow system before work begins.',
      role: 'Employer',
    },
    {
      number: '04',
      title: 'Complete the Work',
      description: 'Job seekers complete the assigned tasks within the agreed timeline.',
      role: 'Job Seeker',
    },
    {
      number: '05',
      title: 'Confirm & Release Payment',
      description: 'Employer confirms job completion, triggering the payment release to the worker.',
      role: 'Both',
    },
    {
      number: '06',
      title: 'Leave Reviews',
      description: 'Both parties leave feedback to build credibility and improve the platform experience.',
      role: 'Both',
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
          <div 
            key={step.number} 
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
